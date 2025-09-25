package com.rkvk.automobile.automobileshop.repository;

import com.rkvk.automobile.automobileshop.entity.UserEmail;
import com.rkvk.automobile.automobileshop.entity.id.UserEmailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserEmailRepository extends JpaRepository<UserEmail, UserEmailId> {

    List<UserEmail> findByUser_UserId(Long userId);

    boolean existsByIdEmail(String email);

    void deleteByIdEmail(String email);

    Optional<Object> findByIdEmail(String email);
}
