package com.rkvk.automobile.automobileshop.service;

import com.rkvk.automobile.automobileshop.dto.ServiceEntityDTO;
import com.rkvk.automobile.automobileshop.entity.ServiceEntity;
import com.rkvk.automobile.automobileshop.exception.ResourceNotFoundException;
import com.rkvk.automobile.automobileshop.mapper.ServiceEntityMapper;
import com.rkvk.automobile.automobileshop.repository.ServiceEntityRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceEntityService {

    private final ServiceEntityRepository serviceEntityRepository;

    public ServiceEntity createService(ServiceEntityDTO dto) {
        return serviceEntityRepository.save(ServiceEntityMapper.toEntity(dto));
    }

    public ServiceEntity updateService(Long id, ServiceEntityDTO dto) {
        ServiceEntity existing = serviceEntityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id " + id));

        existing.setServiceName(dto.getServiceName());
        existing.setDescription(dto.getDescription());

        return serviceEntityRepository.save(existing);
    }

    public void deleteService(Long id) {
        if (!serviceEntityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Service not found with id " + id);
        }
        serviceEntityRepository.deleteById(id);
    }

    public ServiceEntity getServiceById(Long id) {
        return serviceEntityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id " + id));
    }

    public List<ServiceEntity> getAllServices() {
        return serviceEntityRepository.findAll();
    }
}
