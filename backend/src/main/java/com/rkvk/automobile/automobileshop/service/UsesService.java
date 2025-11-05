package com.rkvk.automobile.automobileshop.service;

import com.rkvk.automobile.automobileshop.dto.UsesDTO;
import com.rkvk.automobile.automobileshop.entity.*;
import com.rkvk.automobile.automobileshop.entity.id.UsesId;
import com.rkvk.automobile.automobileshop.exception.InsufficientInventoryException;
import com.rkvk.automobile.automobileshop.exception.ResourceNotFoundException;
import com.rkvk.automobile.automobileshop.mapper.UsesMapper;
import com.rkvk.automobile.automobileshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsesService {

    private final UsesRepository usesRepository;
    private final InvoiceRepository invoiceRepository;
    private final InventoryRepository inventoryRepository;

    /* ✅ Add a used part to invoice and subtract from inventory */
    @Transactional
    public UsesDTO addUsedPart(Long invoiceId, Long partId, int count) {
        if (count <= 0) throw new IllegalArgumentException("Count must be positive");

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id " + invoiceId));

        Inventory part = inventoryRepository.findById(partId)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found with id " + partId));

        if (part.getQuantityAvailable() < count)
            throw new InsufficientInventoryException("Not enough inventory available for part " + part.getName());

        // decrease inventory
        part.setQuantityAvailable(part.getQuantityAvailable() - count);
        inventoryRepository.save(part);

        // if already exists, update count
        UsesId id = new UsesId(invoiceId, partId);
        Uses uses = usesRepository.findById(id).orElse(Uses.builder()
                .id(id)
                .invoice(invoice)
                .part(part)
                .count(0)
                .build());

        uses.setCount(uses.getCount() + count);
        usesRepository.save(uses);

        return UsesMapper.toDTO(uses);
    }

    /* ✅ Update count of a used part (adjust inventory accordingly) */
    @Transactional
    public UsesDTO updateUsedPart(Long invoiceId, Long partId, int newCount) {
        UsesId id = new UsesId(invoiceId, partId);
        Uses uses = usesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Used part not found for given invoice and part"));

        Inventory part = uses.getPart();
        int oldCount = uses.getCount();
        int delta = newCount - oldCount;

        if (delta > 0) {
            if (part.getQuantityAvailable() < delta)
                throw new InsufficientInventoryException("Not enough stock to increase usage");
            part.setQuantityAvailable(part.getQuantityAvailable() - delta);
        } else if (delta < 0) {
            part.setQuantityAvailable(part.getQuantityAvailable() + Math.abs(delta));
        }

        uses.setCount(newCount);
        inventoryRepository.save(part);
        usesRepository.save(uses);
        return UsesMapper.toDTO(uses);
    }

    /* ✅ Remove a used part and return stock */
    @Transactional
    public void deleteUsedPart(Long invoiceId, Long partId) {
        UsesId id = new UsesId(invoiceId, partId);
        Uses uses = usesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Used part not found"));

        Inventory part = uses.getPart();
        if (uses.getCount() != null && uses.getCount() > 0) {
            part.setQuantityAvailable(part.getQuantityAvailable() + uses.getCount());
            inventoryRepository.save(part);
        }

        usesRepository.delete(uses);
    }

    /* ✅ Get all used parts for an invoice */
    public List<UsesDTO> getUsedPartsForInvoice(Long invoiceId) {
        return usesRepository.findByInvoice_InvoiceId(invoiceId).stream()
                .map(UsesMapper::toDTO)
                .collect(Collectors.toList());
    }
}
