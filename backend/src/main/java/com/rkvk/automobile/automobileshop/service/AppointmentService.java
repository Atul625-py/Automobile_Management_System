package com.rkvk.automobile.automobileshop.service;

import com.rkvk.automobile.automobileshop.dto.AppointmentDTO;
import com.rkvk.automobile.automobileshop.entity.*;
import com.rkvk.automobile.automobileshop.exception.ResourceNotFoundException;
import com.rkvk.automobile.automobileshop.mapper.AppointmentMapper;
import com.rkvk.automobile.automobileshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final ServiceEntityRepository serviceEntityRepository;

    public Appointment createAppointment(AppointmentDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + dto.getUserId()));
        Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id " + dto.getVehicleId()));
        ServiceEntity service = serviceEntityRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id " + dto.getServiceId()));

        Appointment appointment = AppointmentMapper.toEntity(dto, user, vehicle, service);
        return appointmentRepository.save(appointment);
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id " + id));
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByUser(Long userId) {
        return appointmentRepository.findByUser_UserId(userId);
    }

    public List<Appointment> getAppointmentsByVehicle(Long vehicleId) {
        return appointmentRepository.findByVehicle_VehicleId(vehicleId);
    }

    public List<Appointment> getAppointmentsByService(Long serviceId) {
        return appointmentRepository.findByService_ServiceId(serviceId);
    }

    // Filter by created time range
    public List<Appointment> getAppointmentsByCreatedRange(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByCreatedAtBetween(start, end);
    }

    // Filter by scheduled appointment time range
    public List<Appointment> getAppointmentsByScheduledRange(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByDateTimeBetween(start, end);
    }

    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment not found with id " + id);
        }
        appointmentRepository.deleteById(id);
    }
}
