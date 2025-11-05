package com.rkvk.automobile.automobileshop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "invoice")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private Long invoiceId;

    @ManyToOne
    @JoinColumn(name = "appointment_id", referencedColumnName = "appointment_id")
    private Appointment appointment;

    @Column(name = "tax_percentage")
    private Double taxPercentage;

    @Column(name = "labour_cost")
    private Double labourCost;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Uses> usedParts = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "invoice_mechanic",
            joinColumns = @JoinColumn(name = "invoice_id"),
            inverseJoinColumns = @JoinColumn(name = "mechanic_id")
    )
    private Set<Mechanic> mechanics = new HashSet<>();
}
