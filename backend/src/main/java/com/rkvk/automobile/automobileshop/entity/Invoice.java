package com.rkvk.automobile.automobileshop.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "invoice")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    @EqualsAndHashCode.Include
    @ToString.Include
    private Long invoiceId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", referencedColumnName = "appointment_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Appointment appointment;

    @Column(name = "tax_percentage")
    private Double taxPercentage;

    @Column(name = "labour_cost")
    private Double labourCost;

    @Builder.Default
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Uses> usedParts = new HashSet<>();

    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "invoice_mechanic",
            joinColumns = @JoinColumn(name = "invoice_id"),
            inverseJoinColumns = @JoinColumn(name = "mechanic_id")
    )
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Mechanic> mechanics = new HashSet<>();
}
