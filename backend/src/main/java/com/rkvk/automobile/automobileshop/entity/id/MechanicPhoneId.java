package com.rkvk.automobile.automobileshop.entity.id;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MechanicPhoneId implements Serializable {

    @Column(name = "mechanic_id")
    private Long mechanicId;

    @Column(name = "phone_no")
    private String phoneNo;

}