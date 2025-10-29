package com.rkvk.automobile.automobileshop.service;

import com.rkvk.automobile.automobileshop.dto.InvoiceDTO;
import com.rkvk.automobile.automobileshop.entity.*;
import com.rkvk.automobile.automobileshop.entity.id.UsesId;
import com.rkvk.automobile.automobileshop.exception.ResourceNotFoundException;
import com.rkvk.automobile.automobileshop.dto.UsedPartDTO;
import com.rkvk.automobile.automobileshop.mapper.InvoiceMapper;
import com.rkvk.automobile.automobileshop.repository.*;
import lombok.RequiredArgsConstructor;
import com.rkvk.automobile.automobileshop.entity.Uses;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final UsesRepository usesRepository;
    private final AppointmentRepository appointmentRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryService inventoryService; // assumes decreaseStock exists

    /**
     * Add parts to the invoice for an appointment.
     * If invoice doesn't exist for that appointment, create it.
     * Decrease inventory and create/update Uses row.
     *
     * Roles: controller will guard via @PreAuthorize (both admin & receptionist can use parts).
     */
    @Transactional
    public Invoice addPartToInvoice(Long appointmentId, Long partId, int count) {
        if (count <= 0) {
            throw new IllegalArgumentException("count must be positive");
        }

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id " + appointmentId));

        Inventory part = inventoryRepository.findById(partId)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found with id " + partId));

        // 1) decrease inventory (will throw InsufficientInventoryException if not enough)
        inventoryService.decreaseStock(partId, count);

        // 2) find or create invoice for appointment
        Invoice invoice = invoiceRepository.findByAppointment_AppointmentId(appointmentId)
                .orElseGet(() -> {
                    Invoice newInv = Invoice.builder()
                            .appointment(appointment)
                            .taxPercentage(0.0) // default -- you can set business defaults
                            .labourCost(0.0)
                            .build();
                    return invoiceRepository.save(newInv);
                });

        // 3) create or update Uses entry
        UsesId usesId = new UsesId(invoice.getInvoiceId(), partId);
        Optional<Uses> existingUsesOpt = usesRepository.findById(usesId);

        Uses uses;
        if (existingUsesOpt.isPresent()) {
            uses = existingUsesOpt.get();
            uses.setCount(uses.getCount() + count);
        } else {
            uses = Uses.builder()
                    .id(usesId)
                    .invoice(invoice)
                    .part(part)
                    .count(count)
                    .build();
        }

        usesRepository.save(uses);

        // ensure invoice.usedParts contains the uses (may be necessary if bidirectional)
        invoice.getUsedParts().removeIf(u -> u.getPart().getPartId().equals(partId)); // remove old to avoid dup
        invoice.getUsedParts().add(uses);

        // 4) persist invoice
        invoice = invoiceRepository.save(invoice);

        return invoice;
    }

    public InvoiceDTO getInvoiceForAppointment(Long appointmentId) {
        Invoice invoice = invoiceRepository.findByAppointment_AppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found for appointment " + appointmentId));
        return InvoiceMapper.toDTO(invoice);
    }

    // core CRUD minimal functions

    public InvoiceDTO getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id " + id));
        return InvoiceMapper.toDTO(invoice);
    }

    public void deleteInvoice(Long id) {
        if (!invoiceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Invoice not found with id " + id);
        }
        invoiceRepository.deleteById(id);
    }
    /**
     * Fetch all invoices for a customer (service record).
     */
    public List<InvoiceDTO> getInvoicesForCustomer(Long customerId) {
        List<Invoice> invoices = invoiceRepository.findAllByCustomerId(customerId);
        return invoices.stream()
                .map(InvoiceMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Fetch all invoices for a vehicle.
     */
    public List<InvoiceDTO> getInvoicesForVehicle(Long vehicleId) {
        List<Invoice> invoices = invoiceRepository.findAllByVehicleId(vehicleId);
        return invoices.stream()
                .map(InvoiceMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update invoice fields and reconcile used parts.
     *
     * Behavior:
     * - Updates taxPercentage and labourCost.
     * - If invoiceDTO.getUsedParts() is provided, it will be used to reconcile Uses rows:
     *     * For each part:
     *        - compute delta = newCount - existingCount
     *        - if delta > 0 => inventoryService.decreaseStock(partId, delta)
     *        - if delta < 0 => inventoryService.increaseStock(partId, -delta)
     *     * New Uses rows are created when needed.
     *     * Uses rows removed from DTO are deleted and their counts returned to inventory.
     *
     * Note: This method assumes InventoryService exposes increaseStock(...) and decreaseStock(...).
     */
    @Transactional
    public InvoiceDTO updateInvoice(Long invoiceId, InvoiceDTO invoiceDTO) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id " + invoiceId));

        // Update simple fields
        invoice.setTaxPercentage(invoiceDTO.getTaxPercentage());
        invoice.setLabourCost(invoiceDTO.getLabourCost());

        // If usedParts present in DTO, reconcile; otherwise leave usedParts unchanged
        if (invoiceDTO.getUsedParts() != null) {
            // Map existing uses by partId
            Map<Long, Uses> existingByPart = invoice.getUsedParts().stream()
                    .filter(Objects::nonNull)
                    .filter(u -> u.getPart() != null && u.getPart().getPartId() != null)
                    .collect(Collectors.toMap(u -> u.getPart().getPartId(), u -> u));

            // Map incoming desired counts by partId
            Map<Long, Integer> desiredCounts = invoiceDTO.getUsedParts().stream()
                    .filter(Objects::nonNull)
                    .filter(up -> up.getPartId() != null)
                    .collect(Collectors.toMap(UsedPartDTO::getPartId, UsedPartDTO::getCount, (a, b) -> b));

            // 1) Handle parts present in DTO (create or update)
            for (Map.Entry<Long, Integer> entry : desiredCounts.entrySet()) {
                Long partId = entry.getKey();
                Integer newCount = entry.getValue() != null ? entry.getValue() : 0;
                Uses existing = existingByPart.get(partId);

                if (existing != null) {
                    int oldCount = existing.getCount() != null ? existing.getCount() : 0;
                    int delta = newCount - oldCount;

                    if (delta > 0) {
                        // consume additional stock
                        inventoryService.decreaseStock(partId, delta);
                    } else if (delta < 0) {
                        // return stock
                        inventoryService.increaseStock(partId, -delta);
                    }

                    existing.setCount(newCount);
                    usesRepository.save(existing);
                } else {
                    // create new Uses row: decrease inventory and persist
                    if (newCount > 0) {
                        inventoryService.decreaseStock(partId, newCount);
                    }

                    Inventory part = inventoryRepository.findById(partId).orElse(null);
                    UsesId usesId = new UsesId(invoiceId, partId);
                    Uses newUses = Uses.builder()
                            .id(usesId)
                            .invoice(invoice)
                            .part(part)
                            .count(newCount)
                            .build();
                    usesRepository.save(newUses);
                    invoice.getUsedParts().add(newUses);
                }
            }

            // 2) Handle parts removed in DTO -> refund stock and delete Uses
            Set<Long> removedPartIds = existingByPart.keySet().stream()
                    .filter(existingPartId -> !desiredCounts.containsKey(existingPartId))
                    .collect(Collectors.toSet());

            for (Long removedPartId : removedPartIds) {
                Uses toRemove = existingByPart.get(removedPartId);
                int qty = toRemove.getCount() != null ? toRemove.getCount() : 0;
                if (qty > 0) {
                    inventoryService.increaseStock(removedPartId, qty);
                }
                usesRepository.delete(toRemove);
                invoice.getUsedParts().removeIf(u -> u.getPart() != null
                        && Objects.equals(u.getPart().getPartId(), removedPartId));
            }
        }

        Invoice saved = invoiceRepository.save(invoice);
        return InvoiceMapper.toDTO(saved);
    }
}
