package com.rkvk.automobile.automobileshop.repository;

import com.rkvk.automobile.automobileshop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByCity(String city);

    List<User> findByRole(User.Role role);

    List<User> findByPinCode(String pinCode);

    List<User> findByFirstNameOrLastName(String firstName, String lastName);
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

}
