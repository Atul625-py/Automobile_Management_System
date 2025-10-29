package com.rkvk.automobile.automobileshop.repository;

import com.rkvk.automobile.automobileshop.entity.Uses;
import com.rkvk.automobile.automobileshop.entity.id.UsesId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsesRepository extends JpaRepository<Uses, UsesId> {

    /**
     * Fetch all parts used in a particular invoice.
     */
    List<Uses> findByInvoice_InvoiceId(Long invoiceId);

    /**
     * Check if a specific part is already used in a given invoice.
     */
    boolean existsByInvoice_InvoiceIdAndPart_PartId(Long invoiceId, Long partId);
}
