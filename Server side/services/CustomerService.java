package com.miko.couponsystemfullstack.services;

import com.miko.couponsystemfullstack.models.Category;
import com.miko.couponsystemfullstack.models.Coupon;
import com.miko.couponsystemfullstack.models.Customer;
import com.miko.couponsystemfullstack.repositories.CompanyRepository;
import com.miko.couponsystemfullstack.repositories.CouponRepository;
import com.miko.couponsystemfullstack.repositories.CustomerRepository;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import javax.security.auth.login.LoginException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Scope("prototype")
public class CustomerService extends ClientService {

    private long customerId;

    public CustomerService(CouponRepository couponRepo, CustomerRepository customerRepo, CompanyRepository companyRepo) {
        super(couponRepo, customerRepo, companyRepo);
    }

    @Override
    public boolean login(String email, String password) throws LoginException {
        Customer customer = customerRepo.findByEmailAndPassword(email, password);
        if (customer != null) {
            customerId = customer.getId();
            return true;
        }
        throw new LoginException();
    }

    /**
     * Adds the coupon to the customer coupons set if
     * the coupon amount is more than zero and does
     * not exists in the customer coupons set
     *
     * @param coupon the coupon to be purchased
     * @return the coupon entity after save
     * @throws EntityNotFoundException if there are no more coupons left
     * @throws EntityExistsException if the coupon already exists in the customer coupons set
     */
    public Coupon purchaseCoupon(Coupon coupon) throws EntityNotFoundException, EntityExistsException {
        Coupon c = couponRepo.findById(coupon.getId()).orElse(null);
        Customer customer = getCustomerDetails();
        // coupon exists:
        if (c != null) {
            // customer didn't bought this coupon before
            if (!getCustomerCoupons().contains(coupon)) {
                // sufficient amount
                if (c.getAmount() > 0) {
                    c.setAmount(c.getAmount() - 1);
                    customer.getCoupons().add(c);
                    Coupon dbCoupon = couponRepo.save(c);
                    customerRepo.save(customer);
                    return dbCoupon;
                } else {
                    throw new EntityNotFoundException(); // no more coupons left
                }
            } else {
                throw new EntityExistsException();
            }
        }
        throw new EntityNotFoundException();
    }

    /**
     * Removes the coupon from the customer coupons set
     *
     * @param coupon the coupon to remove from the customer coupons set
     * @return false if the coupon has been deleted successfully, true otherwise
     */
    public boolean removePurchasedCoupon(Coupon coupon) {
        Customer customer = getCustomerDetails();
        customer.getCoupons().remove(coupon);
        customerRepo.save(customer);
        return getCustomerCoupons().contains(coupon);
    }

    public Set<Coupon> getCustomerCoupons() {
        return getCustomerDetails().getCoupons();
    }

    public Set<Coupon> getCustomerCoupons(Category category) {
        return getCustomerCoupons().stream()
                .filter(coupon -> coupon.getCategory().equals(category)).collect(Collectors.toSet());
    }

    public Set<Coupon> getCustomerCoupons(double maxPrice) {
        return getCustomerCoupons().stream()
                .filter(coupon -> coupon.getPrice() < maxPrice).collect(Collectors.toSet());

    }

    /**
     * Returns the customer entity of this customer service
     *
     * @return the customer entity
     * @throws EntityNotFoundException if the customer does not exists
     */
    public Customer getCustomerDetails() throws EntityNotFoundException {
        return customerRepo.findById(customerId).orElseThrow(EntityNotFoundException::new);
    }
}
