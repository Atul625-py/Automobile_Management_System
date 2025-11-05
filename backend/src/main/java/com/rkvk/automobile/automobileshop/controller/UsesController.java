package com.rkvk.automobile.automobileshop.controller;

import com.rkvk.automobile.automobileshop.dto.UsesDTO;
import com.rkvk.automobile.automobileshop.service.UsesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/uses")
@RequiredArgsConstructor
public class UsesController {

    private final UsesService usesService;

    /* ✅ Add a part to an invoice */
    @PostMapping("/{invoiceId}/parts/{partId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<UsesDTO> addUsedPart(
            @PathVariable Long invoiceId,
            @PathVariable Long partId,
            @RequestParam int count) {

        UsesDTO dto = usesService.addUsedPart(invoiceId, partId, count);
        return ResponseEntity.ok(dto);
    }

    /* ✅ Update used part count */
    @PutMapping("/{invoiceId}/parts/{partId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<UsesDTO> updateUsedPart(
            @PathVariable Long invoiceId,
            @PathVariable Long partId,
            @RequestParam int newCount) {

        UsesDTO dto = usesService.updateUsedPart(invoiceId, partId, newCount);
        return ResponseEntity.ok(dto);
    }

    /* ✅ Delete a used part */
    @DeleteMapping("/{invoiceId}/parts/{partId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<String> deleteUsedPart(
            @PathVariable Long invoiceId,
            @PathVariable Long partId) {

        usesService.deleteUsedPart(invoiceId, partId);
        return ResponseEntity.ok("Part removed from invoice and stock restored");
    }

    /* ✅ Get all used parts for an invoice */
    @GetMapping("/{invoiceId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<UsesDTO>> getUsedPartsForInvoice(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(usesService.getUsedPartsForInvoice(invoiceId));
    }
}
