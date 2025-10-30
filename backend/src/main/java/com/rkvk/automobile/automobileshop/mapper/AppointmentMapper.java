package com.rkvk.automobile.automobileshop.mapper;

import com.rkvk.automobile.automobileshop.dto.AppointmentDTO;
import com.rkvk.automobile.automobileshop.entity.*;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public class AppointmentMapper {

    public static AppointmentDTO toDTO(Appointment entity) {
        if (entity == null) return null;

        return AppointmentDTO.builder()
                .appointmentId(entity.getAppointmentId())
                .userId(entity.getUser() != null ? entity.getUser().getUserId() : null)
                .vehicleId(entity.getVehicle() != null ? entity.getVehicle().getVehicleId() : null)
                .serviceIds(entity.getServices() != null
                        ? entity.getServices().stream()
                        .map(ServiceEntity::getServiceId)
                        .collect(Collectors.toSet())
                        : null)
                .dateTime(entity.getDateTime())
                .createdAt(entity.getCreatedAt())
                .status(entity.getStatus())
                .build();
    }

    public static Appointment toEntity(AppointmentDTO dto, User user, Vehicle vehicle, Set<ServiceEntity> services) {
        if (dto == null) return null;

        return Appointment.builder()
                .appointmentId(dto.getAppointmentId())
                .user(user)
                .vehicle(vehicle)
                .services(services)
                .dateTime(dto.getDateTime())
                .createdAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now())
                .status(dto.getStatus() != null ? dto.getStatus() : Appointment.AppointmentStatus.BOOKED)
                .build();
    }
}
