package com.rkvk.automobile.automobileshop.controller;

import com.rkvk.automobile.automobileshop.dto.InventoryDTO;
import com.rkvk.automobile.automobileshop.entity.Inventory;
import com.rkvk.automobile.automobileshop.mapper.InventoryMapper;
import com.rkvk.automobile.automobileshop.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    // ----- CREATE (ADMIN only) -----
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InventoryDTO> createInventory(@RequestBody InventoryDTO dto) {
        Inventory saved = inventoryService.createInventory(dto);
        return ResponseEntity.ok(InventoryMapper.toDTO(saved));
    }

    // ----- UPDATE (ADMIN only) -----
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InventoryDTO> updateInventory(@PathVariable Long id, @RequestBody InventoryDTO dto) {
        Inventory updated = inventoryService.updateInventory(id, dto);
        return ResponseEntity.ok(InventoryMapper.toDTO(updated));
    }

    // ----- DELETE (ADMIN only) -----
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteInventory(@PathVariable Long id) {
        inventoryService.deleteInventory(id);
        return ResponseEntity.ok("Inventory part deleted successfully");
    }

    // ----- GET SINGLE (both) -----
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<InventoryDTO> getInventoryById(@PathVariable Long id) {
        Inventory part = inventoryService.getInventoryById(id);
        return ResponseEntity.ok(InventoryMapper.toDTO(part));
    }

    // ----- LIST ALL (both) -----
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<InventoryDTO>> getAllInventory() {
        List<InventoryDTO> parts = inventoryService.getAllInventory()
                .stream()
                .map(InventoryMapper::toDTO)
                .toList();
        return ResponseEntity.ok(parts);
    }

    // ----- DECREASE STOCK (both) -----
    @PostMapping("/{id}/decrease")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<InventoryDTO> decreaseStock(
            @PathVariable Long id, @RequestParam int quantity) {
        Inventory updated = inventoryService.decreaseStock(id, quantity);
        return ResponseEntity.ok(InventoryMapper.toDTO(updated));
    }

    // ----- INCREASE STOCK (ADMIN only) -----
    @PostMapping("/{id}/increase")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InventoryDTO> increaseStock(
            @PathVariable Long id, @RequestParam int quantity) {
        Inventory updated = inventoryService.increaseStock(id, quantity);
        return ResponseEntity.ok(InventoryMapper.toDTO(updated));
    }
}
