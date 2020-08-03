import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Coupon } from 'src/app/models/coupon'

@Injectable({
	providedIn: 'root'
})
/*
 * this service is open to any user.
 * including unregistered user in order to view all coupons.
 * Although only registered customers will have the option to buy a coupon
 */
export class GuestService {
	private url = 'show/coupons'

	constructor(private _http: HttpClient) {}

	getAllCoupons(): Observable<Coupon[]> {
		return this._http.get<Coupon[]>(`${this.url}`)
	}

	getCoupon(id: number): Observable<Coupon> {
		return this._http.get<Coupon>(`${this.url}/${id}`)
	}

	getCouponsByCategory(category: string): Observable<Coupon[]> {
		return this._http.get<Coupon[]>(`${this.url}/filter/${category}`)
	}
}
