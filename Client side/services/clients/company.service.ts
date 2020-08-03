import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Coupon } from '../../models/coupon'
import { Company } from '../../models/company'
import { Category } from '../../models/category.enum'
import { AuthService } from '../auth/auth.service'
import { BehaviorSubject } from 'rxjs'

@Injectable({
	providedIn: 'root'
})
export class CompanyService {
	private url: string = '/user/company/'
	private _selectedCoupon: Coupon
	private _couponModifier = new BehaviorSubject<Coupon>(this._selectedCoupon)

	constructor(private _http: HttpClient, private _service: AuthService) {}

	private getToken() {
		return this._service.getToken()
	}

	getCoupon(id: number) {
		return this._http.get<Coupon>(`${this.url}coupon/${id}/${this.getToken()}`)
	}

	getCoupons() {
		return this._http.get<Coupon[]>(`${this.url}coupons/${this.getToken()}`)
	}

	addCoupon(coupon: Coupon) {
		return this._http.post<Coupon>(
			`${this.url}coupon/${this.getToken()}`,
			coupon
		)
	}

	updateCoupon(coupon: Coupon) {
		return this._http.put<Coupon>(
			`${this.url}coupon/${this.getToken()}`,
			coupon
		)
	}

	deleteCoupon(id: number) {
		return this._http.delete(`${this.url}coupon/${id}/${this.getToken()}`, {
			responseType: 'text'
		})
	}

	getDetails() {
		return this._http.get<Company>(`${this.url}${this.getToken()}`)
	}

	getCouponsByCategory(category: string) {
		return this._http.get<Coupon[]>(
			`${this.url}coupons/category/${category}/${this.getToken()}`
		)
	}

	getCouponsByMaxPrice(maxPrice: number) {
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
