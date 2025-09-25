package com.rkvk.automobile.automobileshop.mapper;

import com.rkvk.automobile.automobileshop.dto.InventoryDTO;
import com.rkvk.automobile.automobileshop.entity.Inventory;

public class InventoryMapper {

    public static InventoryDTO toDTO(Inventory entity) {
        if (entity == null) return null;

        return InventoryDTO.builder()
                .partId(entity.getPartId())
                .name(entity.getName())
                .quantityAvailable(entity.getQuantityAvailable())
                .unitPrice(entity.getUnitPrice())
                .build();
    }

    public static Inventory toEntity(InventoryDTO dto) {
        if (dto == null) return null;

        return Inventory.builder()
                .partId(dto.getPartId())
                .name(dto.getName())
                .quantityAvailable(dto.getQuantityAvailable())
                .unitPrice(dto.getUnitPrice())
                .build();
    }
}
