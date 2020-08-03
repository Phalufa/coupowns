import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, BehaviorSubject } from 'rxjs'
import { Customer } from '../../models/customer'
import { Coupon } from '../../models/coupon'
import { Category } from '../../models/category.enum'
import { AuthService } from '../auth/auth.service'

@Injectable({
	providedIn: 'root'
})
export class CustomerService {
	private url = '/user/customer/'
	private _selectedCoupon: Coupon
	private _couponModifier = new BehaviorSubject<Coupon>(this._selectedCoupon)

	constructor(private _http: HttpClient, private _service: AuthService) {}

	private getToken() {
		return this._service.getToken()
	}

	getDetails(): Observable<Customer> {
		return this._http.get<Customer>(`${this.url}${this.getToken()}`)
	}

	purchaseCoupon(coupon: Coupon): Observable<Coupon> {
		return this._http.post<Coupon>(
			`${this.url}coupon/${this.getToken()}`,
			coupon
		)
	}

	removeCoupon(coupon: Coupon) {
		return this._http.request(
			'delete',
			`${this.url}coupon/${this.getToken()}`,
			{
				body: coupon,
				responseType: 'text'
			}
		)
	}

	getCustomerCoupons(): Observable<Coupon[]> {
		return this._http.get<Coupon[]>(`${this.url}coupons/${this.getToken()}`)
	}

	getCustomerCouponsByCategory(category: Category): Observable<Coupon[]> {
		return this._http.get<Coupon[]>(
			`${this.url}coupons/category/${category}/${this.getToken()}`
		)
	}

	getCustomerCouponsByMaxPrice(maxPrice: number): Observable<Coupon[]> {
		return this._http.get<Coupon[]>(
			`${this.url}coupons/price/${maxPrice}/${this.getToken()}`
		)
	}
	setSelectedCoupon(coupon: Coupon): void {
		this._selectedCoupon = coupon
	}

	getSelectedCoupon() {
		return this._selectedCoupon
	}

	getModifiedCoupon() {
		return this._couponModifier.asObservable()
	}

	modifyCoupon(coupon: Coupon) {
		this._couponModifier.next(coupon)
	}
}
