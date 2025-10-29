package com.rkvk.automobile.automobileshop.repository;

import com.rkvk.automobile.automobileshop.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Modifying
    @Transactional
    @Query("UPDATE Inventory i SET i.quantityAvailable = i.quantityAvailable - :count WHERE i.partId = :partId")
    void decreaseStock(Long partId, int count);

    @Query("SELECT i.quantityAvailable FROM Inventory i WHERE i.partId = :partId")
    Integer findStockByPartId(Long partId);
}

