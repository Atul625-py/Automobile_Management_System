package com.rkvk.automobile.automobileshop.mapper;

import com.rkvk.automobile.automobileshop.dto.*;
import com.rkvk.automobile.automobileshop.entity.*;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

public class InvoiceMapper {

    public static InvoiceDTO toDTO(Invoice invoice) {
        if (invoice == null) return null;

        return InvoiceDTO.builder()
                .invoiceId(invoice.getInvoiceId())
                .appointmentId(invoice.getAppointment() != null ? invoice.getAppointment().getAppointmentId() : null)
                .taxPercentage(invoice.getTaxPercentage())
                .labourCost(invoice.getLabourCost())
                .usedParts(mapUsedPartsToDTOs(invoice.getUsedParts()))
                .mechanics(mapMechanicsToDTOs(invoice.getMechanics()))
                .build();
    }

    private static Set<UsedPartDTO> mapUsedPartsToDTOs(Set<Uses> usedParts) {
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

    private static Set<MechanicDTO> mapMechanicsToDTOs(Set<Mechanic> mechanics) {
        if (mechanics == null) return Collections.emptySet();
        return mechanics.stream()
                .map(MechanicMapper::toDTO)
                .collect(Collectors.toSet());
    }

    public static Invoice toEntity(InvoiceDTO dto) {
        if (dto == null) return null;
        Invoice invoice = new Invoice();
        invoice.setInvoiceId(dto.getInvoiceId());
        invoice.setTaxPercentage(dto.getTaxPercentage());
        invoice.setLabourCost(dto.getLabourCost());
        if (dto.getMechanics() != null) {
            Set<Mechanic> mechanicSet = dto.getMechanics().stream()
                    .map(MechanicMapper::toEntity)
                    .collect(Collectors.toSet());
            invoice.setMechanics(mechanicSet);
        }
        return invoice;
    }
}
