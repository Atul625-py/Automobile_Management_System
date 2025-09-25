package com.rkvk.automobile.automobileshop.entity;

import com.rkvk.automobile.automobileshop.entity.id.CanDoId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "can_do")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CanDo {

    @EmbeddedId
    private CanDoId id;

    @ManyToOne
    @MapsId("mechanicId")
    @JoinColumn(name = "mechanic_id", referencedColumnName = "mechanic_id")
    private Mechanic mechanic;

    @ManyToOne
    @MapsId("serviceId") // maps composite key serviceId
    @JoinColumn(name = "service_id", referencedColumnName = "service_id")
    private ServiceEntity service;
}

