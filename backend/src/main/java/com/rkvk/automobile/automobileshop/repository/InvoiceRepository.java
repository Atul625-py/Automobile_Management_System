package com.rkvk.automobile.automobileshop.repository;

import com.rkvk.automobile.automobileshop.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    /**
     * Find the invoice linked to a specific appointment.
     */
    Optional<Invoice> findByAppointment_AppointmentId(Long appointmentId);

    /**
     * Check if an invoice exists for an appointment.
     */
    boolean existsByAppointment_AppointmentId(Long appointmentId);
}
