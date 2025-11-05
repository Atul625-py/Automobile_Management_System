package com.rkvk.automobile.automobileshop.service;

import com.rkvk.automobile.automobileshop.dto.*;
import com.rkvk.automobile.automobileshop.entity.*;
import com.rkvk.automobile.automobileshop.entity.id.UsesId;
import com.rkvk.automobile.automobileshop.exception.*;
import com.rkvk.automobile.automobileshop.mapper.InvoiceMapper;
import com.rkvk.automobile.automobileshop.repository.*;
import lombok.RequiredArgsConstructor;
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
    private final MechanicRepository mechanicRepository;

    @Transactional
    public InvoiceDTO createInvoice(InvoiceDTO dto) {
        Invoice invoice = InvoiceMapper.toEntity(dto);

        if (dto.getAppointmentId() != null) {
            Appointment appointment = appointmentRepository.findById(dto.getAppointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
            invoice.setAppointment(appointment);
        }

        invoice = invoiceRepository.save(invoice);

        // handle used parts & adjust inventory
        if (dto.getUsedParts() != null) {
            for (UsedPartDTO up : dto.getUsedParts()) {
                if (up.getPartId() == null) continue;
                Inventory part = inventoryRepository.findById(up.getPartId())
                        .orElseThrow(() -> new ResourceNotFoundException("Part not found"));

                int count = up.getCount() != null ? up.getCount() : 0;
                if (count > part.getQuantityAvailable()) {
                    throw new InsufficientInventoryException("Not enough stock for part: " + part.getName());
                }

                part.setQuantityAvailable(part.getQuantityAvailable() - count);
                inventoryRepository.save(part);

                Uses uses = Uses.builder()
                        .id(new UsesId(invoice.getInvoiceId(), part.getPartId()))
                        .invoice(invoice)
                        .part(part)
                        .count(count)
                        .build();

                usesRepository.save(uses);
                invoice.getUsedParts().add(uses);
            }
        }

        // attach mechanics
        if (dto.getMechanics() != null) {
            Set<Mechanic> mechanics = dto.getMechanics().stream()
                    .map(m -> mechanicRepository.findById(m.getMechanicId())
                            .orElseThrow(() -> new ResourceNotFoundException("Mechanic not found")))
                    .collect(Collectors.toSet());
            invoice.setMechanics(mechanics);
        }

        return InvoiceMapper.toDTO(invoiceRepository.save(invoice));
    }

    public InvoiceDTO getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .map(InvoiceMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
    }

    public InvoiceDTO getInvoiceForAppointment(Long appointmentId) {
        return invoiceRepository.findByAppointment_AppointmentId(appointmentId)
                .map(InvoiceMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found for appointment"));
    }

    @Transactional
    public InvoiceDTO updateInvoice(Long invoiceId, InvoiceDTO dto) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));

        invoice.setTaxPercentage(dto.getTaxPercentage());
        invoice.setLabourCost(dto.getLabourCost());

        // used parts update logic unchanged
        Map<Long, Uses> existingUses = invoice.getUsedParts().stream()
                .collect(Collectors.toMap(u -> u.getPart().getPartId(), u -> u));

        Set<Long> incomingPartIds = new HashSet<>();
        if (dto.getUsedParts() != null) {
            for (UsedPartDTO up : dto.getUsedParts()) {
                Long partId = up.getPartId();
                incomingPartIds.add(partId);

                Inventory part = inventoryRepository.findById(partId)
                        .orElseThrow(() -> new ResourceNotFoundException("Part not found"));
                int newCount = up.getCount();
                Uses existing = existingUses.get(partId);

                if (existing != null) {
                    int oldCount = existing.getCount();
                    int delta = newCount - oldCount;
                    if (delta > 0 && part.getQuantityAvailable() < delta)
                        throw new InsufficientInventoryException("Not enough stock for " + part.getName());
                    part.setQuantityAvailable(part.getQuantityAvailable() - delta);
                    inventoryRepository.save(part);
                    existing.setCount(newCount);
                    usesRepository.save(existing);
                } else {
                    if (newCount > part.getQuantityAvailable())
                        throw new InsufficientInventoryException("Not enough stock for " + part.getName());
                    part.setQuantityAvailable(part.getQuantityAvailable() - newCount);
                    inventoryRepository.save(part);
                    Uses newUse = Uses.builder()
                            .id(new UsesId(invoiceId, partId))
                            .invoice(invoice)
                            .part(part)
                            .count(newCount)
                            .build();
                    usesRepository.save(newUse);
                    invoice.getUsedParts().add(newUse);
                }
            }
        }

        for (Uses u : new HashSet<>(invoice.getUsedParts())) {
            if (!incomingPartIds.contains(u.getPart().getPartId())) {
                Inventory part = u.getPart();
                part.setQuantityAvailable(part.getQuantityAvailable() + u.getCount());
                inventoryRepository.save(part);
                usesRepository.delete(u);
                invoice.getUsedParts().remove(u);
            }
        }

        // update mechanics
        if (dto.getMechanics() != null) {
            Set<Mechanic> newMechanics = dto.getMechanics().stream()
                    .map(m -> mechanicRepository.findById(m.getMechanicId())
                            .orElseThrow(() -> new ResourceNotFoundException("Mechanic not found")))
                    .collect(Collectors.toSet());
            invoice.setMechanics(newMechanics);
        }

        return InvoiceMapper.toDTO(invoiceRepository.save(invoice));
    }

    public void deleteInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));

        for (Uses u : invoice.getUsedParts()) {
            Inventory part = u.getPart();
            part.setQuantityAvailable(part.getQuantityAvailable() + u.getCount());
            inventoryRepository.save(part);
        }

        invoiceRepository.delete(invoice);
    }
    // ---------------------------------------------------------------------------
// Fetch all invoices for a given customer (via vehicle → appointment chain)
// ---------------------------------------------------------------------------
    public List<InvoiceDTO> getInvoicesForCustomer(Long customerId) {
        List<Invoice> invoices = invoiceRepository.findAllByCustomerId(customerId);
        return invoices.stream()
                .map(InvoiceMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------------------
// Fetch all invoices for a specific vehicle
// ---------------------------------------------------------------------------
    public List<InvoiceDTO> getInvoicesForVehicle(Long vehicleId) {
        List<Invoice> invoices = invoiceRepository.findAllByVehicleId(vehicleId);
        return invoices.stream()
                .map(InvoiceMapper::toDTO)
                .collect(Collectors.toList());
    }

}
