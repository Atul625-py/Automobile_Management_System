package com.rkvk.automobile.automobileshop.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsesDTO {
    private Long invoiceId;
    private Long partId;
    private String partName;
    private Integer count;
    private Double unitPrice;
    private Double lineTotal;
}
