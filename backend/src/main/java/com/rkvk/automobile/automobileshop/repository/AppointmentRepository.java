package com.rkvk.automobile.automobileshop.repository;

import com.rkvk.automobile.automobileshop.entity.Appointment;
import com.rkvk.automobile.automobileshop.entity.Appointment.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByUser_UserId(Long userId);
    List<Appointment> findByVehicle_VehicleId(Long vehicleId);
    List<Appointment> findByService_ServiceId(Long serviceId);
    List<Appointment> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Appointment> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);

    // New status-based queries
    List<Appointment> findByStatus(AppointmentStatus status);
    List<Appointment> findByUser_UserIdAndStatus(Long userId, AppointmentStatus status);
    List<Appointment> findByVehicle_VehicleIdAndStatus(Long vehicleId, AppointmentStatus status);
}
