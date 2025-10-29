package com.rkvk.automobile.automobileshop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    // Flattened view of used parts
    private Set<UsedPartDTO> usedParts;
}