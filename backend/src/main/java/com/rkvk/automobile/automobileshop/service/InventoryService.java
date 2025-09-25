package com.rkvk.automobile.automobileshop.service;

import com.rkvk.automobile.automobileshop.dto.InventoryDTO;
import com.rkvk.automobile.automobileshop.entity.Inventory;
import com.rkvk.automobile.automobileshop.exception.InsufficientInventoryException;
import com.rkvk.automobile.automobileshop.exception.ResourceNotFoundException;
import com.rkvk.automobile.automobileshop.mapper.InventoryMapper;
import com.rkvk.automobile.automobileshop.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public Inventory createInventory(InventoryDTO dto) {
        return inventoryRepository.save(InventoryMapper.toEntity(dto));
    }

    public Inventory updateInventory(Long id, InventoryDTO dto) {
        Inventory existing = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found with id " + id));

        existing.setName(dto.getName());
        existing.setQuantityAvailable(dto.getQuantityAvailable());
        existing.setUnitPrice(dto.getUnitPrice());

        return inventoryRepository.save(existing);
    }

    public void deleteInventory(Long id) {
        if (!inventoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Part not found with id " + id);
        }
        inventoryRepository.deleteById(id);
    }

    public Inventory getInventoryById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found with id " + id));
    }

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    // --- Decrease stock (sell/use part) ---
    public Inventory decreaseStock(Long partId, int quantity) {
        Inventory part = inventoryRepository.findById(partId)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found with id " + partId));

        if (part.getQuantityAvailable() < quantity) {
            throw new InsufficientInventoryException("Not enough stock for part " + part.getName());
        }

        part.setQuantityAvailable(part.getQuantityAvailable() - quantity);
        return inventoryRepository.save(part);
    }

    // --- Increase stock (order/add inventory, ADMIN only) ---
    public Inventory increaseStock(Long partId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity to add must be positive");
        }

        Inventory part = inventoryRepository.findById(partId)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found with id " + partId));

        part.setQuantityAvailable(part.getQuantityAvailable() + quantity);
        return inventoryRepository.save(part);
    }
}
