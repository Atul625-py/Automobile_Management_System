package com.rkvk.automobile.automobileshop.repository;

import com.rkvk.automobile.automobileshop.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByAppointment_AppointmentId(Long appointmentId);

    boolean existsByAppointment_AppointmentId(Long appointmentId);

    @Query("""
           SELECT i 
           FROM Invoice i
           JOIN i.appointment a
           JOIN a.vehicle v
           JOIN v.customer c
           WHERE c.customerId = :customerId
           ORDER BY i.invoiceId DESC
           """)
    List<Invoice> findAllByCustomerId(@Param("customerId") Long customerId);

    // ✅ Get all invoices for a specific vehicle
    @Query("""
           SELECT i
           FROM Invoice i
           JOIN i.appointment a
           JOIN a.vehicle v
           WHERE v.vehicleId = :vehicleId
           ORDER BY i.invoiceId DESC
           """)
    List<Invoice> findAllByVehicleId(@Param("vehicleId") Long vehicleId);

}
