package com.miko.couponsystemfullstack.services;

import com.miko.couponsystemfullstack.models.Category;
import com.miko.couponsystemfullstack.models.Company;
import com.miko.couponsystemfullstack.models.Coupon;
import com.miko.couponsystemfullstack.models.Customer;
import com.miko.couponsystemfullstack.repositories.CompanyRepository;
import com.miko.couponsystemfullstack.repositories.CouponRepository;
import com.miko.couponsystemfullstack.repositories.CustomerRepository;
import com.miko.couponsystemfullstack.services.exceptions.CouponDateException;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import javax.security.auth.login.LoginException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Scope("prototype")
public class CompanyService extends ClientService {

    private long companyId;

    public CompanyService(CouponRepository couponRepo, CustomerRepository customerRepo, CompanyRepository companyRepo) {
        super(couponRepo, customerRepo, companyRepo);
    }

    @Override
    public boolean login(String email, String password) throws LoginException {
        Company company = companyRepo.findByEmailAndPassword(email, password);
        if (company != null) {
            companyId = company.getId();
            return true;
        }
        throw new LoginException();
    }

    /**
     * Saves the new coupon to the database only if there is no other coupon
     * with the same ID or title
     *
     * @param coupon the coupon to save
     * @return the new coupon that was saved
     * @throws EntityExistsException if another coupon has the same title or ID
     * @throws CouponDateException if startDate is before or equal to current date or endDate before startDate
     */
    public Coupon addCoupon(Coupon coupon) throws EntityExistsException, CouponDateException {
        if (isTitleInvalid(coupon) || couponRepo.existsById(coupon.getId()))
            throw new EntityExistsException();

        if (isDateInvalid(coupon))
            throw new CouponDateException();

        return couponRepo.save(coupon);
    }

    /**
     * update the coupon if it exists by its ID
     * and has different title than the other company's coupons
     *
     * @param coupon the company to update
     * @return the updated coupon
     * @throws EntityNotFoundException if the coupon does not exists by it's ID
     * @throws EntityExistsException if there is another coupon with the same title
     * @throws CouponDateException if startDate is before or equal to current date or endDate before startDate
     */
    public Coupon updateCoupon(Coupon coupon) throws EntityNotFoundException, EntityExistsException, CouponDateException {
        if (!couponRepo.existsById(coupon.getId()))
            throw new EntityNotFoundException();

        if (isTitleInvalid(coupon))
            throw new EntityExistsException();

        if (isDateInvalid(coupon)) {
            throw new CouponDateException();
        }

        return couponRepo.save(coupon);
    }

    /**
     * delete a company coupon by its ID
     *
     * @param id the ID of the coupon to be deleted
     * @return false if the coupon has been deleted successfully, true otherwise
     * @throws EntityNotFoundException if the company is trying to delete a coupon that is owned by another company
     */
    public boolean deleteCoupon(long id) throws EntityNotFoundException{
        couponRepo.findById(id)
                .ifPresent(coupon -> {
                    // check if the coupon is owned by the company
            if (coupon.getCompany().getId() == companyId) {
                // delete the coupon from each customer coupon set
                List<Customer> customers = customerRepo.findAll();
                for (Customer customer : customers)
                    customer.getCoupons().remove(coupon);

                customerRepo.saveAll(customers);
                couponRepo.deleteById(id);
            } else {
                throw new EntityNotFoundException();
            }
        });
        return couponRepo.existsById(id);
    }

    // returns true if param coupon title has the same title as another
    // company coupon, false otherwise
    private boolean isTitleInvalid(Coupon coupon) {
        return getCompanyCoupons().stream()
                .anyMatch(c -> c.getTitle().equalsIgnoreCase(coupon.getTitle()) && c.getId() != coupon.getId());
    }

    // returns true if param coupon startDate is before current date or equal or endDate is before startDate
    // false otherwise
    private boolean isDateInvalid(Coupon coupon) {
        return coupon.getStartDate().before(new Date()) || coupon.getEndDate().before(coupon.getStartDate());
    }

    /**
     * Returns the company entity of this company service
     *
     * @return the company entity
     * @throws EntityNotFoundException if the company doesn't exists
     */
    public Company getCompanyDetails() throws EntityNotFoundException {
        return companyRepo.findById(companyId).orElseThrow(EntityNotFoundException::new);
    }

    /**
     * Returns a coupon only if it exists and owned by the company
     *
     * @param id the if of the coupon to get
     * @return the coupon
     * @throws EntityNotFoundException if the coupon doesn't exists or isn't the company's coupon
     */
    public Coupon getCompanyCouponById(long id) throws EntityNotFoundException {
        Optional<Coupon> c = couponRepo.findById(id);
        c.ifPresent(coupon -> {
            if (coupon.getCompany().getId() != companyId)
                throw new EntityNotFoundException();
        });
        return c.orElseThrow(EntityNotFoundException::new);
    }

    public Set<Coupon> getCompanyCoupons() {
        return getCompanyDetails().getCoupons();
    }

    public Set<Coupon> getCompanyCoupons(Category category) {
        return getCompanyCoupons()
                .stream()
                .filter(coupon -> coupon.getCategory().equals(category))
                .collect(Collectors.toSet());
    }

    public Set<Coupon> getCompanyCoupons(double maxPrice) {
        return getCompanyCoupons()
                .stream()
                .filter(coupon -> coupon.getPrice() < maxPrice)
                .collect(Collectors.toSet());
    }
}
