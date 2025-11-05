package com.rkvk.automobile.automobileshop.controller;

import com.rkvk.automobile.automobileshop.dto.InvoiceDTO;
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

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<InvoiceDTO> createInvoice(@RequestBody InvoiceDTO dto) {
        return ResponseEntity.ok(invoiceService.createInvoice(dto));
    }

    @GetMapping("/{invoiceId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<InvoiceDTO> getInvoice(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(invoiceId));
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<InvoiceDTO> getInvoiceForAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(invoiceService.getInvoiceForAppointment(appointmentId));
    }

    @PutMapping("/{invoiceId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<InvoiceDTO> updateInvoice(
            @PathVariable Long invoiceId,
            @RequestBody InvoiceDTO dto) {
        return ResponseEntity.ok(invoiceService.updateInvoice(invoiceId, dto));
    }

    @DeleteMapping("/{invoiceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteInvoice(@PathVariable Long invoiceId) {
        invoiceService.deleteInvoice(invoiceId);
        return ResponseEntity.ok("Invoice deleted and inventory restored");
    }

    @GetMapping("/customers/{customerId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<InvoiceDTO>> getInvoicesForCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(invoiceService.getInvoicesForCustomer(customerId));
    }

    @GetMapping("/vehicles/{vehicleId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<InvoiceDTO>> getInvoicesForVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(invoiceService.getInvoicesForVehicle(vehicleId));
    }
}
