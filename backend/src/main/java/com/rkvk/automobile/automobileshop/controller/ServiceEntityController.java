package com.rkvk.automobile.automobileshop.controller;

import com.rkvk.automobile.automobileshop.dto.ServiceEntityDTO;
import com.rkvk.automobile.automobileshop.entity.ServiceEntity;
import com.rkvk.automobile.automobileshop.mapper.ServiceEntityMapper;
import com.rkvk.automobile.automobileshop.service.ServiceEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceEntityController {

    private final ServiceEntityService serviceEntityService;

    // ----- CREATE -----
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceEntityDTO> createService(@RequestBody ServiceEntityDTO dto) {
        ServiceEntity saved = serviceEntityService.createService(dto);
        return ResponseEntity.ok(ServiceEntityMapper.toDTO(saved));
    }

    // ----- UPDATE -----
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceEntityDTO> updateService(@PathVariable Long id, @RequestBody ServiceEntityDTO dto) {
        ServiceEntity updated = serviceEntityService.updateService(id, dto);
        return ResponseEntity.ok(ServiceEntityMapper.toDTO(updated));
    }

    // ----- DELETE -----
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteService(@PathVariable Long id) {
        serviceEntityService.deleteService(id);
        return ResponseEntity.ok("Service deleted successfully");
    }

    // ----- GET SINGLE -----
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<ServiceEntityDTO> getServiceById(@PathVariable Long id) {
        ServiceEntity entity = serviceEntityService.getServiceById(id);
        return ResponseEntity.ok(ServiceEntityMapper.toDTO(entity));
    }

    // ----- LIST ALL -----
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<ServiceEntityDTO>> getAllServices() {
        List<ServiceEntityDTO> services = serviceEntityService.getAllServices()
                .stream()
                .map(ServiceEntityMapper::toDTO)
                .toList();
        return ResponseEntity.ok(services);
    }
}
