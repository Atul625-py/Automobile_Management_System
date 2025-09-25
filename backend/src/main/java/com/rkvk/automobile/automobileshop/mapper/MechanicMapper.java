package com.rkvk.automobile.automobileshop.mapper;

import com.rkvk.automobile.automobileshop.dto.MechanicDTO;
import com.rkvk.automobile.automobileshop.entity.Mechanic;

public class MechanicMapper {

    public static MechanicDTO toDTO(Mechanic mechanic) {
        if (mechanic == null) {
            return null;
        }
        return MechanicDTO.builder()
                .mechanicId(mechanic.getMechanicId())
                .firstName(mechanic.getFirstName())
                .lastName(mechanic.getLastName())
                .houseNo(mechanic.getHouseNo())
                .street(mechanic.getStreet())
                .locality(mechanic.getLocality())
                .city(mechanic.getCity())
                .pinCode(mechanic.getPinCode())
                .build();
    }

    public static Mechanic toEntity(MechanicDTO dto) {
        if (dto == null) {
            return null;
        }
        return Mechanic.builder()
                .mechanicId(dto.getMechanicId())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .houseNo(dto.getHouseNo())
                .street(dto.getStreet())
                .locality(dto.getLocality())
                .city(dto.getCity())
                .pinCode(dto.getPinCode())
                .build();
    }
}
