package com.miko.couponsystemfullstack.services;

import com.miko.couponsystemfullstack.models.Company;
import com.miko.couponsystemfullstack.models.Customer;
import com.miko.couponsystemfullstack.repositories.CompanyRepository;
import com.miko.couponsystemfullstack.repositories.CouponRepository;
import com.miko.couponsystemfullstack.repositories.CustomerRepository;
import org.springframework.context.annotation.Scope;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import javax.security.auth.login.LoginException;
import java.util.List;

@Service
@Scope("prototype")
public class AdminService extends ClientService {

    public AdminService(CouponRepository couponRepo, CustomerRepository customerRepo, CompanyRepository companyRepo) {
        super(couponRepo, customerRepo, companyRepo);
    }

    @Override
    public boolean login(String email, String password) throws LoginException {
        if (email.equalsIgnoreCase("admin@admin.com") && password.equalsIgnoreCase("admin"))
            return true;
        throw new LoginException();
    }

    /**
     * Saves the new company only if there is no other existing
     * company with the same ID, name or email.
     *
     * @param company the new company to save
     * @throws EntityExistsException if there is another company with similar id or name or email
     */
    public Company addCompany(Company company) throws EntityExistsException, DataAccessException {
        if (companyRepo.findAll().contains(company))    // same ID or name or email
            throw new EntityExistsException();

        return companyRepo.save(company);
    }

    /**
     * Saves the company only if it exists by it's ID,
     * and has different name and email than the other companies.
     *
     * @param company the company to update
     * @throws EntityNotFoundException if the company does not exists by it's ID
     * @throws EntityExistsException if there is another company with the same name or email
     */
    public Company updateCompany(Company company) throws EntityNotFoundException, EntityExistsException, DataAccessException {
        if (!companyRepo.existsById(company.getId()))
            throw new EntityNotFoundException();

        if (companyRepo.findAll()
                .stream()
                .anyMatch(c -> c.getId() != company.getId() &&
                        (c.getName().equalsIgnoreCase(company.getName()) ||
                                c.getEmail().equalsIgnoreCase(company.getEmail())))
        )
            throw new EntityExistsException();

        return companyRepo.save(company);
    }

    public boolean deleteCompany(long id) throws DataAccessException {
        // delete all customers coupon owned by the company
        customerRepo.findAll()
                .forEach(customer -> {
                    customer.getCoupons().removeIf(coupon -> coupon.getCompany().getId() == id);
                    customerRepo.save(customer);
                });
        companyRepo.deleteById(id);
        return companyRepo.existsById(id);
    }

    public Company getCompany(long id) {
        return companyRepo.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    public List<Company> getCompanies() {
        return companyRepo.findAll();
    }

    /**
     * Saves the customer only if there is no other existing customer
     * with the same ID or email
     *
     * @param customer the new customer to save
     * @throws EntityExistsException if another customer has the same ID or email
     * @return the customer entity after creation
     */
    public Customer addCustomer(Customer customer) throws EntityExistsException, DataAccessException {
        if (customerRepo.findAll().contains(customer))  // same ID or email
            throw new EntityExistsException();

        return customerRepo.save(customer);
    }

    /**
     * Update the customer details only if it exists by it's ID
     * and has a different email than the other customers
     *
     * @param customer the customer to update
     * @throws EntityNotFoundException if the customer does not exists by it's ID
     * @return the customer entity after update
     */
    public Customer updateCustomer(Customer customer) throws EntityNotFoundException {
        if (!customerRepo.existsById(customer.getId()))
            throw new EntityNotFoundException();

        if (customerRepo.findAll()
                .stream()
                .anyMatch(c -> c.getEmail().equalsIgnoreCase(customer.getEmail()) && c.getId() != customer.getId())
        )
            throw new EntityExistsException();

        return customerRepo.save(customer);
    }

    /**
     * Deletes a customer by it's ID
     *
     * @param id the id of the customer to delete
     * @return false if the entity has been deleted successfully, true otherwise
     */
    public boolean deleteCustomer(long id) {
        if (customerRepo.existsById(id)) {
            // TODO check if it is necessary to delete the customer's coupons before delete the customer itself
//            Customer c = getCustomer(id);
//            c.getCoupons().clear();
//            customerRepo.save(c);
            customerRepo.deleteById(id);
        } else {
            throw new EntityNotFoundException();
        }
        return customerRepo.existsById(id);
    }

    public Customer getCustomer(long id) throws EntityNotFoundException{
        return customerRepo.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    public List<Customer> getCustomers() {
        return customerRepo.findAll();
    }
}
