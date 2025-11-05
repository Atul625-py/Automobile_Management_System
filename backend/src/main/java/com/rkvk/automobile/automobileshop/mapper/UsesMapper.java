package com.rkvk.automobile.automobileshop.mapper;

import com.rkvk.automobile.automobileshop.dto.UsesDTO;
import com.rkvk.automobile.automobileshop.entity.Inventory;
import com.rkvk.automobile.automobileshop.entity.Invoice;
import com.rkvk.automobile.automobileshop.entity.Uses;
import com.rkvk.automobile.automobileshop.entity.id.UsesId;

public class UsesMapper {

    public static UsesDTO toDTO(Uses uses) {
        if (uses == null) return null;
        Double price = (uses.getPart() != null) ? uses.getPart().getUnitPrice() : null;
        Integer count = uses.getCount() != null ? uses.getCount() : 0;
        return UsesDTO.builder()
                .invoiceId(uses.getInvoice() != null ? uses.getInvoice().getInvoiceId() : null)
                .partId(uses.getPart() != null ? uses.getPart().getPartId() : null)
                .partName(uses.getPart() != null ? uses.getPart().getName() : null)
                .count(count)
                .unitPrice(price)
                .lineTotal(price != null ? price * count : null)
                .build();
    }

    public static Uses toEntity(UsesDTO dto, Invoice invoice, Inventory part) {
        if (dto == null) return null;
        UsesId id = new UsesId(invoice.getInvoiceId(), part.getPartId());
        return Uses.builder()
                .id(id)
                .invoice(invoice)
                .part(part)
                .count(dto.getCount())
                .build();
    }
}
