package com.rkvk.automobile.automobileshop.controller;

import com.rkvk.automobile.automobileshop.dto.InvoiceDTO;
import com.rkvk.automobile.automobileshop.entity.Invoice;
import com.rkvk.automobile.automobileshop.mapper.InvoiceMapper;
import com.rkvk.automobile.automobileshop.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    /**
     * Add a part usage to appointment's invoice.
     * Both ADMIN and RECEPTIONIST can perform this.
     *
     * POST /api/invoices/{appointmentId}/parts
     * body: { "partId": 123, "count": 2 }
     */
    @PostMapping("/{appointmentId}/parts")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<InvoiceDTO> addPartToInvoice(
            @PathVariable Long appointmentId,
            @RequestParam Long partId,
            @RequestParam int count) {

        Invoice invoice = invoiceService.addPartToInvoice(appointmentId, partId, count);
        return ResponseEntity.ok(InvoiceMapper.toDTO(invoice));
    }

    /**
     * Get invoice for an appointment
     */
    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<InvoiceDTO> getInvoiceForAppointment(@PathVariable Long appointmentId) {
        InvoiceDTO dto = invoiceService.getInvoiceForAppointment(appointmentId);
        return ResponseEntity.ok(dto);
    }

    /**
     * Get invoice by id
     */
    @GetMapping("/{invoiceId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<InvoiceDTO> getInvoiceById(@PathVariable Long invoiceId) {
        InvoiceDTO dto = invoiceService.getInvoiceById(invoiceId);
        return ResponseEntity.ok(dto);
    }

    /**
     * Delete an invoice (ADMIN only)
     */
    @DeleteMapping("/{invoiceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteInvoice(@PathVariable Long invoiceId) {
        invoiceService.deleteInvoice(invoiceId);
        return ResponseEntity.ok("Invoice deleted");
    }

    // Get all invoices (service record) for a customer (all vehicles)
    @GetMapping("/customers/{customerId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<InvoiceDTO>> getInvoicesForCustomer(@PathVariable Long customerId) {
        List<InvoiceDTO> dtos = invoiceService.getInvoicesForCustomer(customerId);
        return ResponseEntity.ok(dtos);
    }

    // Get all invoices (service record) for a vehicle
    @GetMapping("/vehicles/{vehicleId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<InvoiceDTO>> getInvoicesForVehicle(@PathVariable Long vehicleId) {
        List<InvoiceDTO> dtos = invoiceService.getInvoicesForVehicle(vehicleId);
        return ResponseEntity.ok(dtos);
    }

    /**
     * Update an existing invoice (tax, labour and usedParts allowed).
     * Both ADMIN and RECEPTIONIST can update invoices.
     *
     * PUT /api/invoices/{invoiceId}
     * body: InvoiceDTO (usedParts will be reconciled against existing uses; inventory adjusted accordingly)
     */
    @PutMapping("/{invoiceId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<InvoiceDTO> updateInvoice(
            @PathVariable Long invoiceId,
            @RequestBody InvoiceDTO invoiceDTO) {

        InvoiceDTO updated = invoiceService.updateInvoice(invoiceId, invoiceDTO);
        return ResponseEntity.ok(updated);
    }

}