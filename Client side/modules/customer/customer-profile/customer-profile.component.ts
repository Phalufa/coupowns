import { Component, OnInit } from '@angular/core'
import { Customer } from 'src/app/models/customer'
import { Observable } from 'rxjs'
import { Coupon } from 'src/app/models/coupon'
import { Category } from 'src/app/models/category.enum'
import { CustomerService } from 'src/app/services/clients/customer.service'
import { pluck } from 'rxjs/operators'

@Component({
	selector: 'app-customer-profile',
	templateUrl: './customer-profile.component.html'
})
export class CustomerProfileComponent implements OnInit {
	customerDetails$: Observable<Customer>
	customerNumOfCoupons$: Observable<Coupon[]>
	categories = Category

	constructor(private _service: CustomerService) {}

	ngOnInit(): void {
		this.customerDetails$ = this._service.getDetails()
		this.customerNumOfCoupons$ = this.customerDetails$.pipe(pluck('coupons'))
	}

	filterCoupons(coupons: Coupon[], category: Category) {
		return coupons.filter(coupon => coupon.category == category)
	}
}
