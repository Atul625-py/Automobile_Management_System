package com.rkvk.automobile.automobileshop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDTO {
    private Long appointmentId;

    private Long userId;
    private Long vehicleId;
    private Long serviceId;

    private LocalDateTime dateTime;
    private LocalDateTime createdAt;
}
