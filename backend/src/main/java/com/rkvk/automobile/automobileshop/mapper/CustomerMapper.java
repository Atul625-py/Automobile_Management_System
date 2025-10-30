package com.rkvk.automobile.automobileshop.mapper;

import com.rkvk.automobile.automobileshop.dto.CustomerDTO;
import com.rkvk.automobile.automobileshop.entity.Customer;
import com.rkvk.automobile.automobileshop.entity.CustomerEmail;
import com.rkvk.automobile.automobileshop.entity.CustomerMiddleName;
import com.rkvk.automobile.automobileshop.entity.id.CustomerEmailId;
import com.rkvk.automobile.automobileshop.entity.id.CustomerMiddleNameId;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CustomerMapper {

    public Customer dtoToEntity(CustomerDTO dto) {
        if (dto == null) {
            return null;
        }

        Customer customer = Customer.builder()
                .customerId(dto.getCustomerId()) // Include ID if available (for update)
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .houseNo(dto.getHouseNo())
                .street(dto.getStreet())
                .locality(dto.getLocality())
                .city(dto.getCity())
                .pinCode(dto.getPinCode())
                .build();

        if (dto.getMiddleNames() != null) {
            customer.setMiddleNames(
                    dto.getMiddleNames().stream()
                            .map(m -> CustomerMiddleName.builder()
                                    .id(new CustomerMiddleNameId(customer.getCustomerId(), m))
                                    .middleNameOrder(0)
                                    .customer(customer)
                                    .build()
                            ).collect(Collectors.toList())
            );
        }

        if (dto.getEmails() != null) {
            customer.setEmails(
                    dto.getEmails().stream()
                            .map(e -> CustomerEmail.builder()
                                    .id(new CustomerEmailId(customer.getCustomerId(), e))
                                    .customer(customer)
                                    .build()
                            ).collect(Collectors.toList())
            );
        }

        return customer;
    }

    public CustomerDTO entityToDto(Customer customer) {
        if (customer == null) {
            return null;
        }

        CustomerDTO dto = new CustomerDTO();
        dto.setCustomerId(customer.getCustomerId()); // Map ID back
        dto.setFirstName(customer.getFirstName());
        dto.setLastName(customer.getLastName());
        dto.setHouseNo(customer.getHouseNo());
        dto.setStreet(customer.getStreet());
        dto.setLocality(customer.getLocality());
        dto.setCity(customer.getCity());
        dto.setPinCode(customer.getPinCode());

        if (customer.getMiddleNames() != null) {
            dto.setMiddleNames(
                    customer.getMiddleNames().stream()
                            .map(m -> m.getId().getMiddleName())
                            .collect(Collectors.toList())
            );
        }

        if (customer.getEmails() != null) {
            dto.setEmails(
                    customer.getEmails().stream()
                            .map(e -> e.getId().getEmail())
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }
}
