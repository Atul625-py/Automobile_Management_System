package com.rkvk.automobile.automobileshop.repository;

import com.rkvk.automobile.automobileshop.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceEntityRepository extends JpaRepository<ServiceEntity, Long> {
}
