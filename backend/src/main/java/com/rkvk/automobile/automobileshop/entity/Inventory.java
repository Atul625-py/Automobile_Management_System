package com.rkvk.automobile.automobileshop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "part_id")
    private Long partId;

    @Column(name = "name")
    private String name;

    @Column(name = "quantity_available")
    private Integer quantityAvailable;

    @Column(name = "unit_price")
    private Double unitPrice;

    @OneToMany(mappedBy = "part")
    private Set<Uses> usedInInvoices = new HashSet<>();

}

