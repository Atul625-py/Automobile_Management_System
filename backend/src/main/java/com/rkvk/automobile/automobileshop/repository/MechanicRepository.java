package com.rkvk.automobile.automobileshop.repository;

import com.rkvk.automobile.automobileshop.entity.Mechanic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MechanicRepository extends JpaRepository<Mechanic, Long> {

    List<Mechanic> findByCity(String city);

    List<Mechanic> findByPinCode(String pinCode);

    List<Mechanic> findByFirstNameContainingIgnoreCase(String firstName);

    List<Mechanic> findByLastNameContainingIgnoreCase(String lastName);

    List<Mechanic> findByCityAndPinCode(String city, String pinCode);
}
