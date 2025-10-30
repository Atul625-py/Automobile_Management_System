package com.rkvk.automobile.automobileshop.controller;

import com.rkvk.automobile.automobileshop.dto.AppointmentDTO;
import com.rkvk.automobile.automobileshop.entity.Appointment;
import com.rkvk.automobile.automobileshop.mapper.AppointmentMapper;
import com.rkvk.automobile.automobileshop.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<AppointmentDTO> createAppointment(@RequestBody AppointmentDTO dto) {
        Appointment saved = appointmentService.createAppointment(dto);
        return ResponseEntity.ok(AppointmentMapper.toDTO(saved));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<AppointmentDTO> getAppointmentById(@PathVariable Long id) {
        Appointment appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(AppointmentMapper.toDTO(appointment));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<AppointmentDTO>> getAllAppointments() {
        List<AppointmentDTO> list = appointmentService.getAllAppointments()
                .stream().map(AppointmentMapper::toDTO).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<AppointmentDTO>> getByUser(@PathVariable Long userId) {
        List<AppointmentDTO> list = appointmentService.getAppointmentsByUser(userId)
                .stream().map(AppointmentMapper::toDTO).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/vehicle/{vehicleId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<AppointmentDTO>> getByVehicle(@PathVariable Long vehicleId) {
        List<AppointmentDTO> list = appointmentService.getAppointmentsByVehicle(vehicleId)
                .stream().map(AppointmentMapper::toDTO).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/service/{serviceId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<AppointmentDTO>> getByService(@PathVariable Long serviceId) {
        List<AppointmentDTO> list = appointmentService.getAppointmentsByService(serviceId)
                .stream().map(AppointmentMapper::toDTO).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/created-range")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<AppointmentDTO>> getByCreatedRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<AppointmentDTO> list = appointmentService.getAppointmentsByCreatedRange(start, end)
                .stream().map(AppointmentMapper::toDTO).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/scheduled-range")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<AppointmentDTO>> getByScheduledRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<AppointmentDTO> list = appointmentService.getAppointmentsByScheduledRange(start, end)
                .stream().map(AppointmentMapper::toDTO).toList();
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<String> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok("Appointment deleted successfully");
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<AppointmentDTO>> getByStatus(@PathVariable Appointment.AppointmentStatus status) {
        List<AppointmentDTO> list = appointmentService.getAppointmentsByStatus(status)
                .stream().map(AppointmentMapper::toDTO).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/user/{userId}/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<AppointmentDTO>> getByUserAndStatus(@PathVariable Long userId,
                                                                   @PathVariable Appointment.AppointmentStatus status) {
        List<AppointmentDTO> list = appointmentService.getAppointmentsByUserAndStatus(userId, status)
                .stream().map(AppointmentMapper::toDTO).toList();
        return ResponseEntity.ok(list);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<AppointmentDTO> updateStatus(@PathVariable Long id,
                                                       @RequestParam Appointment.AppointmentStatus status) {
        Appointment updated = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(AppointmentMapper.toDTO(updated));
    }
}
