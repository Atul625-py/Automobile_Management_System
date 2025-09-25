package com.rkvk.automobile.automobileshop.mapper;

import com.rkvk.automobile.automobileshop.dto.VehicleDTO;
import com.rkvk.automobile.automobileshop.entity.Customer;
import com.rkvk.automobile.automobileshop.entity.Vehicle;

public class VehicleMapper {

    // DTO -> Entity
    public static Vehicle toEntity(VehicleDTO dto, Customer customer) {
        if (dto == null) return null;

        return Vehicle.builder()
                .vehicleId(dto.getVehicleId())
                .registrationNo(dto.getRegistrationNo())
                .brand(dto.getBrand())
                .model(dto.getModel())
                .year(dto.getYear())
                .fuelType(dto.getFuelType())
                .customer(customer) // attach actual Customer entity
                .build();
    }

    // Entity -> DTO
    public static VehicleDTO toDto(Vehicle vehicle) {
        if (vehicle == null) return null;

        return VehicleDTO.builder()
                .vehicleId(vehicle.getVehicleId())
                .registrationNo(vehicle.getRegistrationNo())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .year(vehicle.getYear())
                .fuelType(vehicle.getFuelType())
                .customerId(vehicle.getCustomer() != null ? vehicle.getCustomer().getCustomerId() : null)
                .build();
    }
}