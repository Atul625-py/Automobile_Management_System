package com.rkvk.automobile.automobileshop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.rkvk.automobile.automobileshop.entity.id.UsesId;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "uses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class Uses {

    @EmbeddedId
    @EqualsAndHashCode.Include
    @ToString.Include
    private UsesId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("invoiceId")
    @JoinColumn(name = "invoice_id", referencedColumnName = "invoice_id")
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("partId")
    @JoinColumn(name = "part_id", referencedColumnName = "part_id")
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Inventory part;

    @Column(name = "count")
    private Integer count;
}
