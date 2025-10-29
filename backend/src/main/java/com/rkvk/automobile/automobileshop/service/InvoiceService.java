package com.rkvk.automobile.automobileshop.service;

import com.rkvk.automobile.automobileshop.dto.InvoiceDTO;
import com.rkvk.automobile.automobileshop.entity.*;
import com.rkvk.automobile.automobileshop.entity.id.UsesId;
import com.rkvk.automobile.automobileshop.exception.ResourceNotFoundException;
import com.rkvk.automobile.automobileshop.mapper.InvoiceMapper;
import com.rkvk.automobile.automobileshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

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
}