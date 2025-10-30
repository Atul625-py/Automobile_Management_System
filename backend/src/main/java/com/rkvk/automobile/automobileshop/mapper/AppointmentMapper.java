package com.rkvk.automobile.automobileshop.mapper;

import com.rkvk.automobile.automobileshop.dto.AppointmentDTO;
import com.rkvk.automobile.automobileshop.entity.Appointment;
import com.rkvk.automobile.automobileshop.entity.ServiceEntity;
import com.rkvk.automobile.automobileshop.entity.User;
import com.rkvk.automobile.automobileshop.entity.Vehicle;
import java.time.LocalDateTime;

public class AppointmentMapper {

    public static AppointmentDTO toDTO(Appointment entity) {
        if (entity == null) return null;

        return AppointmentDTO.builder()
                .appointmentId(entity.getAppointmentId())
                .userId(entity.getUser() != null ? entity.getUser().getUserId() : null)
                .vehicleId(entity.getVehicle() != null ? entity.getVehicle().getVehicleId() : null)
                .serviceId(entity.getService() != null ? entity.getService().getServiceId() : null)
                .dateTime(entity.getDateTime())
                .createdAt(entity.getCreatedAt())
                .status(entity.getStatus())
                .build();
    }

    public static Appointment toEntity(AppointmentDTO dto, User user, Vehicle vehicle, ServiceEntity service) {
        if (dto == null) return null;

        return Appointment.builder()
                .appointmentId(dto.getAppointmentId())
                .user(user)
                .vehicle(vehicle)
                .service(service)
                .dateTime(dto.getDateTime())
                .createdAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now())
                .status(dto.getStatus() != null ? dto.getStatus() : Appointment.AppointmentStatus.BOOKED)
                .build();
    }
}
