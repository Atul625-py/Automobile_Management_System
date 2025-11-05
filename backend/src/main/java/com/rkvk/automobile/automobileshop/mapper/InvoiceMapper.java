package com.rkvk.automobile.automobileshop.mapper;

import com.rkvk.automobile.automobileshop.dto.*;
import com.rkvk.automobile.automobileshop.entity.*;

import java.util.*;
import java.util.stream.Collectors;

public class InvoiceMapper {

    /* -------------------- ENTITY → DTO -------------------- */
    public static InvoiceDTO toDTO(Invoice invoice) {
        if (invoice == null) return null;

        return InvoiceDTO.builder()
                .invoiceId(invoice.getInvoiceId())
                .appointmentId(invoice.getAppointment() != null ? invoice.getAppointment().getAppointmentId() : null)
                .taxPercentage(invoice.getTaxPercentage())
                .labourCost(invoice.getLabourCost())
                .usedParts(toUsedPartDTOs(invoice.getUsedParts()))
                .mechanics(toMechanicDTOs(invoice.getMechanics()))
                .build();
    }

    private static Set<UsedPartDTO> toUsedPartDTOs(Set<Uses> usedParts) {
        if (usedParts == null) return Collections.emptySet();

        return usedParts.stream()
                .filter(Objects::nonNull)
                .map(u -> {
                    Double unitPrice = (u.getPart() != null) ? u.getPart().getUnitPrice() : null;
                    Integer count = u.getCount();
                    Double lineTotal = (unitPrice != null && count != null) ? unitPrice * count : null;

                    return UsedPartDTO.builder()
                            .partId(u.getPart() != null ? u.getPart().getPartId() : null)
                            .partName(u.getPart() != null ? u.getPart().getName() : null)
                            .unitPrice(unitPrice)
                            .count(count)
                            .lineTotal(lineTotal)
                            .build();
                })
                .collect(Collectors.toSet());
    }

    private static Set<MechanicDTO> toMechanicDTOs(Set<Mechanic> mechanics) {
        if (mechanics == null) return Collections.emptySet();

        return mechanics.stream()
                .filter(Objects::nonNull)
                .map(MechanicMapper::toDTO)
                .collect(Collectors.toSet());
    }

    /* -------------------- DTO → ENTITY -------------------- */
    public static Invoice toEntity(InvoiceDTO dto) {
        if (dto == null) return null;

        // Initialize sets to prevent null-pointer issues (critical fix)
        Invoice invoice = Invoice.builder()
                .invoiceId(dto.getInvoiceId())
                .taxPercentage(dto.getTaxPercentage())
                .labourCost(dto.getLabourCost())
                .usedParts(new HashSet<>())   // ✅ ensure not null
                .mechanics(new HashSet<>())   // ✅ ensure not null
                .build();

        // Optional: if mechanics come in DTO (e.g., for update)
        if (dto.getMechanics() != null && !dto.getMechanics().isEmpty()) {
            Set<Mechanic> mechanicSet = dto.getMechanics().stream()
                    .filter(Objects::nonNull)
                    .map(MechanicMapper::toEntity)
                    .collect(Collectors.toSet());
            invoice.setMechanics(mechanicSet);
        }

        return invoice;
    }
}
