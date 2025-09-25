package com.rkvk.automobile.automobileshop.mapper;

import com.rkvk.automobile.automobileshop.dto.ServiceEntityDTO;
import com.rkvk.automobile.automobileshop.entity.ServiceEntity;

public class ServiceEntityMapper {

    public static ServiceEntityDTO toDTO(ServiceEntity entity) {
        if (entity == null) {
            return null;
        }
        return ServiceEntityDTO.builder()
                .serviceId(entity.getServiceId())
                .serviceName(entity.getServiceName())
                .description(entity.getDescription())
                .build();
    }

    public static ServiceEntity toEntity(ServiceEntityDTO dto) {
        if (dto == null) {
            return null;
        }
        return ServiceEntity.builder()
                .serviceId(dto.getServiceId())
                .serviceName(dto.getServiceName())
                .description(dto.getDescription())
                .build();
    }
}
