import { Component, OnInit } from '@angular/core'
import { Coupon } from 'src/app/models/coupon'
import { CompanyService } from 'src/app/services/clients/company.service'
import { OpenSnackBarService } from 'src/app/services/shared/open-snack-bar.service'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { take } from 'rxjs/operators'

@Component({
	selector: 'app-manage-coupons',
	templateUrl: './manage-coupons.component.html'
})
export class ManageCouponsComponent implements OnInit {
	coupons: Coupon[]
	query: string = '' // user search text
	selectedCoupon: Coupon
	couponsUpdates: Subscription

	constructor(
		private _service: CompanyService,
		private _snackBarService: OpenSnackBarService,
		private _router: Router
	) {}

	ngOnInit(): void {
		this._service
			.getCoupons()
			.pipe(take(1))
			.subscribe(coupons => (this.coupons = coupons))

		// apply changes to the coupon array
		this.onUpdates()
	}

	select(coupon: Coupon): void {
		// if user selects twice and did not understand what to do
		if (this.selectedCoupon === coupon) {
			this._snackBarService.open(
				`Selected coupon: "${
					this._service.getSelectedCoupon().title
				}". Choose an operation: DELETE, EDIT, CREATE`
			)
			return
		}
		this.selectedCoupon = coupon
		this._service.setSelectedCoupon(coupon)
		this._snackBarService.open(
			`Selected coupon: "${this._service.getSelectedCoupon().title}"`
		)
	}

	add(): void {
		this._router.navigate(['company/coupons/new'])
	}

	edit(): void {
		this._router.navigate(['company/coupons/update'])
	}

	delete(coupon: Coupon): void {
		this._service
			.deleteCoupon(coupon.id)
			.pipe(take(1))
			.subscribe(res => {
				this._snackBarService.open(res)
				this.coupons.splice(this.coupons.indexOf(coupon), 1)
				this._service.modifyCoupon(null)
				this.selectedCoupon = null
			})
	}

	// notify on each change in coupons array
	onUpdates() {
		this.couponsUpdates = this._service
			.getModifiedCoupon()
			.subscribe(coupon => {
				if (!coupon) return
				if (this.coupons) {
					if (this.coupons.length > 0) {
						const check = this.coupons.find(c => c.id === coupon.id)
						if (check) {
							// coupon has been updated
							let i = this.coupons.indexOf(check)
							this.coupons[i] = coupon
						} else {
							// new coupon to add
							this.coupons.push(coupon)
						}
					} else {
						// no coupons yet, just push the new one:
						this.coupons.push(coupon)
					}
				}
			})
	}

	ngOnDestroy(): void {
		this.couponsUpdates.unsubscribe()
	}
}
