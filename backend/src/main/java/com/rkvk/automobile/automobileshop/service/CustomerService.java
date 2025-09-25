package com.rkvk.automobile.automobileshop.service;

import com.rkvk.automobile.automobileshop.dto.CustomerDTO;
import com.rkvk.automobile.automobileshop.entity.Customer;
import com.rkvk.automobile.automobileshop.entity.CustomerEmail;
import com.rkvk.automobile.automobileshop.entity.CustomerMiddleName;
import com.rkvk.automobile.automobileshop.entity.id.CustomerEmailId;
import com.rkvk.automobile.automobileshop.entity.id.CustomerMiddleNameId;
import com.rkvk.automobile.automobileshop.mapper.CustomerMapper;
import com.rkvk.automobile.automobileshop.repository.CustomerEmailRepository;
import com.rkvk.automobile.automobileshop.repository.CustomerMiddleNameRepository;
import com.rkvk.automobile.automobileshop.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMiddleNameRepository middleNameRepository;
    private final CustomerEmailRepository emailRepository;
    private final CustomerMapper customerMapper;

    // Add Customer with middle names & emails
    public Customer addCustomer(CustomerDTO dto) {
        Customer customer = customerMapper.dtoToEntity(dto);
        Customer savedCustomer = customerRepository.save(customer);

        saveMiddleNamesAndEmails(savedCustomer, dto);

        return savedCustomer;
    }

    public Customer updateCustomer(Long id, CustomerDTO dto) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        existingCustomer.setFirstName(dto.getFirstName());
        existingCustomer.setLastName(dto.getLastName());
        existingCustomer.setHouseNo(dto.getHouseNo());
        existingCustomer.setStreet(dto.getStreet());
        existingCustomer.setLocality(dto.getLocality());
        existingCustomer.setCity(dto.getCity());
        existingCustomer.setPinCode(dto.getPinCode());

        Customer savedCustomer = customerRepository.save(existingCustomer);

        // Replace old middle names & emails
        if (dto.getMiddleNames() != null) {
            middleNameRepository.deleteAll(middleNameRepository.findByIdCustomerId(id));
        }
        if (dto.getEmails() != null) {
            emailRepository.deleteAll(emailRepository.findByIdCustomerId(id));
        }

        saveMiddleNamesAndEmails(savedCustomer, dto);

        return savedCustomer;
    }

    public CustomerDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        CustomerDTO dto = customerMapper.entityToDto(customer);

        List<String> middleNames = middleNameRepository.findByIdCustomerId(id)
                .stream()
                .map(m -> m.getId().getMiddleName())
                .toList();
        dto.setMiddleNames(middleNames);

        List<String> emails = emailRepository.findByIdCustomerId(id)
                .stream()
                .map(e -> e.getId().getEmail())
                .toList();
        dto.setEmails(emails);

        return dto;
    }

    public List<CustomerDTO> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();

        return customers.stream().map(customer -> {
            CustomerDTO dto = customerMapper.entityToDto(customer);

            // middle names
            List<String> middleNames = middleNameRepository.findByIdCustomerId(customer.getCustomerId())
                    .stream()
                    .map(m -> m.getId().getMiddleName())
                    .toList();
            dto.setMiddleNames(middleNames);

            // emails
            List<String> emails = emailRepository.findByIdCustomerId(customer.getCustomerId())
                    .stream()
                    .map(e -> e.getId().getEmail())
                    .toList();
            dto.setEmails(emails);

            return dto;
        }).toList();
    }

    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        customerRepository.delete(customer);
    }


    private void saveMiddleNamesAndEmails(Customer customer, CustomerDTO dto) {
        if (dto.getMiddleNames() != null) {
            int order = 1;
            for (String middleName : dto.getMiddleNames()) {
                CustomerMiddleNameId id = new CustomerMiddleNameId(customer.getCustomerId(), middleName);
                CustomerMiddleName cmn = CustomerMiddleName.builder()
                        .id(id)
                        .middleNameOrder(order++)
                        .customer(customer)
                        .build();
                middleNameRepository.save(cmn);
            }
        }

        if (dto.getEmails() != null) {
            for (String email : dto.getEmails()) {
                CustomerEmailId id = new CustomerEmailId(customer.getCustomerId(), email);
                CustomerEmail ce = CustomerEmail.builder()
                        .id(id)
                        .customer(customer)
                        .build();
                emailRepository.save(ce);
            }
        }
    }
}
