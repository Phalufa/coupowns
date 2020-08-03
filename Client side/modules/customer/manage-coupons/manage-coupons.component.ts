import { Component, OnInit } from '@angular/core'
import { CustomerService } from 'src/app/services/clients/customer.service'
import { Coupon } from 'src/app/models/coupon'
import { OpenSnackBarService } from 'src/app/services/shared/open-snack-bar.service'
import { take } from 'rxjs/operators'

@Component({
	selector: 'app-manage-coupons',
	templateUrl: './manage-coupons.component.html'
})
export class ManageCouponsComponent implements OnInit {
	coupons: Coupon[]
	query: string = '' // user search text
	selectedCoupon: Coupon

	constructor(
		private _service: CustomerService,
		private _snackBarService: OpenSnackBarService
	) {}

	ngOnInit(): void {
		this._service
			.getCustomerCoupons()
			.pipe(take(1))
			.subscribe(coupons => (this.coupons = coupons))
	}

	select(coupon: Coupon): void {
		// if user selects twice and did not understand what to do
		if (this.selectedCoupon === coupon) {
			this._snackBarService.open(
				`Selected coupon: "${
					this._service.getSelectedCoupon().title
				}". To remove a coupon click on REMOVE PURCHASE`
			)
			return
		}
		this.selectedCoupon = coupon
		this._service.setSelectedCoupon(coupon)
		this._snackBarService.open(
			`Selected coupon: "${this._service.getSelectedCoupon().title}"`
		)
	}

	remove(coupon: Coupon): void {
		this._service
			.removeCoupon(coupon)
			.pipe(take(1))
			.subscribe(res => {
				this._snackBarService.open(res)
				this.coupons.splice(this.coupons.indexOf(coupon), 1)
				this._service.modifyCoupon(null)
				this.selectedCoupon = null
			})
	}
}
