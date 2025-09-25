package com.rkvk.automobile.automobileshop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleDTO {

    private Long vehicleId;
    private String registrationNo;
    private String brand;
    private String model;
    private int year;
    private String fuelType;

    private Long customerId;
}