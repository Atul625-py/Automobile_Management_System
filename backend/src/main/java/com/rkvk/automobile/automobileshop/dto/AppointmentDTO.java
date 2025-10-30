package com.rkvk.automobile.automobileshop.dto;

import com.rkvk.automobile.automobileshop.entity.Appointment.AppointmentStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDTO {
    private Long appointmentId;
    private Long userId;
    private Long vehicleId;

    // now multiple services
    private Set<Long> serviceIds;

    private LocalDateTime dateTime;
    private LocalDateTime createdAt;

    private AppointmentStatus status;
}
