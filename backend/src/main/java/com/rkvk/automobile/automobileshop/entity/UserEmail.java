package com.rkvk.automobile.automobileshop.entity;

import com.rkvk.automobile.automobileshop.entity.id.UserEmailId;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_email")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEmail {

    @EmbeddedId
    private UserEmailId id;

     @ManyToOne
     @MapsId("userId")
     @JoinColumn(name = "user_id", referencedColumnName = "user_id")
     private User user;

}

