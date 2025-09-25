package com.rkvk.automobile.automobileshop.repository;

import com.rkvk.automobile.automobileshop.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Find all appointments for a user
    List<Appointment> findByUser_UserId(Long userId);

    // Find all appointments for a vehicle
    List<Appointment> findByVehicle_VehicleId(Long vehicleId);

    // Find all appointments for a service
    List<Appointment> findByService_ServiceId(Long serviceId);

    // Find by creation time range
    List<Appointment> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // Find by scheduled appointment time range
    List<Appointment> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);
}
