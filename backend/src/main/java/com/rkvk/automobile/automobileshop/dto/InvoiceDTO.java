package com.rkvk.automobile.automobileshop.dto;

import lombok.*;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceDTO {
    private Long invoiceId;
    private Long appointmentId;
    private Double taxPercentage;
    private Double labourCost;
    private Set<UsedPartDTO> usedParts;
    private Set<MechanicDTO> mechanics;
}
