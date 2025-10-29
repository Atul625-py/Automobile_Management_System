package com.rkvk.automobile.automobileshop.mapper;

import com.rkvk.automobile.automobileshop.dto.InvoiceDTO;
import com.rkvk.automobile.automobileshop.dto.UsedPartDTO;
import com.rkvk.automobile.automobileshop.entity.Invoice;
import com.rkvk.automobile.automobileshop.entity.Uses;
import com.rkvk.automobile.automobileshop.entity.id.UsesId;
import com.rkvk.automobile.automobileshop.entity.Inventory;
import com.rkvk.automobile.automobileshop.entity.Appointment;

import java.util.Collections;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Manual mapper between Invoice <-> InvoiceDTO
 *
 * Notes:
 *  - toEntity(...) returns a minimal Invoice (no appointment, no usedParts).
 *  - toEntityWithReferences(...) allows setting appointment and reconstructing Uses entries.
 *    It requires a partFetcher function to resolve partId -> Inventory (e.g. repo::findByIdOrNull).
 */
public class InvoiceMapper {

    /* -------------------- Entity -> DTO -------------------- */

    public static InvoiceDTO toDTO(Invoice invoice) {
        if (invoice == null) return null;

        return InvoiceDTO.builder()
                .invoiceId(invoice.getInvoiceId())
                .appointmentId(invoice.getAppointment() != null ? invoice.getAppointment().getAppointmentId() : null)
                .taxPercentage(invoice.getTaxPercentage())
                .labourCost(invoice.getLabourCost())
                .usedParts(mapUsedPartsToDTOs(invoice.getUsedParts()))
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


    /* -------------------- DTO -> Entity (basic) -------------------- */

    /**
     * Minimal conversion: does NOT set appointment or usedParts.
     * Use toEntityWithReferences if you want to restore relations.
     */
    public static Invoice toEntity(InvoiceDTO dto) {
        if (dto == null) return null;

        return Invoice.builder()
                .invoiceId(dto.getInvoiceId())
                .taxPercentage(dto.getTaxPercentage())
                .labourCost(dto.getLabourCost())
                // appointment and usedParts intentionally not set here
                .build();
    }

    /* -------------------- DTO -> Entity (with references) -------------------- */

    /**
     * Full conversion that attempts to reconstruct Uses entries.
     *
     * @param dto          the incoming DTO
     * @param appointment  the Appointment to attach (may be null)
     * @param partFetcher  function to resolve partId -> Inventory. If null or returns null,
     *                     a placeholder Inventory with only id set will be created.
     *                     Example: partFetcher = id -> inventoryRepository.findById(id).orElse(null)
     */
    public static Invoice toEntityWithReferences(
            InvoiceDTO dto,
            Appointment appointment,
            Function<Long, Inventory> partFetcher) {

        if (dto == null) return null;

        Invoice invoice = Invoice.builder()
                .invoiceId(dto.getInvoiceId())
                .taxPercentage(dto.getTaxPercentage())
                .labourCost(dto.getLabourCost())
                .build();

        // attach appointment if provided
        if (appointment != null) {
            invoice.setAppointment(appointment);
        }

        // build Uses set from DTO usedParts
        if (dto.getUsedParts() != null && !dto.getUsedParts().isEmpty()) {
            Set<Uses> uses = dto.getUsedParts().stream()
                    .filter(Objects::nonNull)
                    .map(upDto -> buildUsesFromDTO(upDto, invoice, partFetcher))
                    .collect(Collectors.toSet());

            invoice.setUsedParts(uses);
        }

        return invoice;
    }

    /**
     * Construct a Uses entity for a single UsedPartDTO.
     * - If dto.invoiceId is present it will be used as UsesId.invoiceId; otherwise UsesId.invoiceId will be null
     *   (JPA will set it after persisting the invoice).
     * - The Inventory is fetched via partFetcher if provided; otherwise a placeholder Inventory with only partId set is created.
     */
    private static Uses buildUsesFromDTO(UsedPartDTO upDto, Invoice invoice, Function<Long, Inventory> partFetcher) {
        Uses uses = new Uses();

        Long invoiceId = invoice != null ? invoice.getInvoiceId() : null;
        Long partId = upDto.getPartId();

        // set composite id (invoiceId may be null for new invoices)
        UsesId id = new UsesId(invoiceId, partId);
        uses.setId(id);

        // attach invoice reference (helps JPA bidirectional consistency)
        uses.setInvoice(invoice);

        // resolve Inventory (part)
        Inventory part = null;
        if (partFetcher != null && partId != null) {
            try {
                part = partFetcher.apply(partId);
            } catch (Exception ex) {
                // swallow — we'll create a placeholder below
                part = null;
            }
        }

        if (part == null && partId != null) {
            Inventory placeholder = new Inventory();
            placeholder.setPartId(partId);
            // other fields left null — JPA will attach actual entity on persist/merge if necessary
            part = placeholder;
        }
        uses.setPart(part);


        // count from DTO
        uses.setCount(upDto.getCount());

        return uses;
    }
}
