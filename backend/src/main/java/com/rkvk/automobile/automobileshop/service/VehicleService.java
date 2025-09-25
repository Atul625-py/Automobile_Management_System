package com.rkvk.automobile.automobileshop.service;

import com.rkvk.automobile.automobileshop.dto.VehicleDTO;
import com.rkvk.automobile.automobileshop.entity.Customer;
import com.rkvk.automobile.automobileshop.entity.Vehicle;
import com.rkvk.automobile.automobileshop.mapper.VehicleMapper;
import com.rkvk.automobile.automobileshop.repository.CustomerRepository;
import com.rkvk.automobile.automobileshop.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final CustomerRepository customerRepository;

    public VehicleDTO addVehicle(VehicleDTO dto) {
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + dto.getCustomerId()));

        Vehicle vehicle = VehicleMapper.toEntity(dto, customer);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        return VehicleMapper.toDto(savedVehicle);
    }

    public VehicleDTO getVehicleById(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + vehicleId));
        return VehicleMapper.toDto(vehicle);
    }

    public List<VehicleDTO> getVehiclesByCustomer(Long customerId) {
        return vehicleRepository.findByCustomerCustomerId(customerId)
                .stream()
                .map(VehicleMapper::toDto)
                .toList();
    }

    public VehicleDTO updateVehicle(Long vehicleId, VehicleDTO dto) {
        Vehicle existingVehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + vehicleId));

        existingVehicle.setRegistrationNo(dto.getRegistrationNo());
        existingVehicle.setBrand(dto.getBrand());
        existingVehicle.setModel(dto.getModel());
        existingVehicle.setYear(dto.getYear());
        existingVehicle.setFuelType(dto.getFuelType());

        Vehicle updatedVehicle = vehicleRepository.save(existingVehicle);
        return VehicleMapper.toDto(updatedVehicle);
    }

    public void deleteVehicle(Long vehicleId) {
        if (!vehicleRepository.existsById(vehicleId)) {
            throw new RuntimeException("Vehicle not found with id: " + vehicleId);
        }
        vehicleRepository.deleteById(vehicleId);
    }

    public List<VehicleDTO> getAllVehicles() {
        return vehicleRepository.findAll()
                .stream()
                .map(VehicleMapper::toDto) // or your manual mapper
                .toList();
    }

}