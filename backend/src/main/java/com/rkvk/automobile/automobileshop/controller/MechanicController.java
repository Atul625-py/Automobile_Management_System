package com.rkvk.automobile.automobileshop.controller;

import com.rkvk.automobile.automobileshop.dto.MechanicDTO;
import com.rkvk.automobile.automobileshop.entity.Mechanic;
import com.rkvk.automobile.automobileshop.mapper.MechanicMapper;
import com.rkvk.automobile.automobileshop.service.MechanicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mechanics")
@RequiredArgsConstructor
public class MechanicController {

    private final MechanicService mechanicService;

    // ----- CREATE -----
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MechanicDTO> createMechanic(@RequestBody MechanicDTO dto) {
        Mechanic saved = mechanicService.createMechanic(dto);
        return ResponseEntity.ok(MechanicMapper.toDTO(saved));
    }

    // ----- UPDATE -----
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MechanicDTO> updateMechanic(@PathVariable Long id, @RequestBody MechanicDTO dto) {
        Mechanic updated = mechanicService.updateMechanic(id, dto);
        return ResponseEntity.ok(MechanicMapper.toDTO(updated));
    }

    // ----- DELETE -----
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteMechanic(@PathVariable Long id) {
        mechanicService.deleteMechanic(id);
        return ResponseEntity.ok("Mechanic deleted successfully");
    }

    // ----- GET SINGLE -----
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<MechanicDTO> getMechanicById(@PathVariable Long id) {
        Mechanic mechanic = mechanicService.getMechanicById(id);
        return ResponseEntity.ok(MechanicMapper.toDTO(mechanic));
    }

    // ----- LIST ALL -----
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<MechanicDTO>> getAllMechanics() {
        List<MechanicDTO> mechanics = mechanicService.getAllMechanics()
                .stream()
                .map(MechanicMapper::toDTO)
                .toList();
        return ResponseEntity.ok(mechanics);
    }

}
