package com.rkvk.automobile.automobileshop.repository;

import com.rkvk.automobile.automobileshop.entity.Uses;
import com.rkvk.automobile.automobileshop.entity.id.UsesId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UsesRepository extends JpaRepository<Uses, UsesId> {
    List<Uses> findByInvoice_InvoiceId(Long invoiceId);
}
