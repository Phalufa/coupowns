import { Component, OnInit } from '@angular/core'
import { Coupon } from 'src/app/models/coupon'
import { Observable } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { GuestService } from 'src/app/services/clients/guest.service'
import { map, tap, take } from 'rxjs/operators'
import { AuthService } from 'src/app/services/auth/auth.service'
import { CustomerService } from 'src/app/services/clients/customer.service'
import { OpenSnackBarService } from 'src/app/services/shared/open-snack-bar.service'

@Component({
	selector: 'app-coupon',
	templateUrl: './coupon.component.html',
	styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {
	coupon$: Observable<Coupon>
	purchaseable: string = '* '

	constructor(
		private _service: GuestService,
		private _authService: AuthService,
		private _customerService: CustomerService,
		private _snackBarService: OpenSnackBarService,
		private _route: ActivatedRoute,
		private _router: Router
	) {}

	isValidForPurchase(): boolean {
		return (
			this._authService.getRole() === 'CUSTOMER' &&
			this._authService.isLogged$.value
		)
	}

	onPurchase(coupon: Coupon) {
		this._customerService
			.purchaseCoupon(coupon)
			.pipe(take(1))
			.subscribe(res =>
				this._snackBarService.open(
					`Enjoy your new coupon: ${res.title}. You can see your coupons in your Dashboard`
				)
			)
	}

	goHome() {
		this._router.navigateByUrl("/home")
	}

	ngOnInit(): void {
		let id = this._route.snapshot.paramMap.get('id')
		this.coupon$ = this._service.getCoupon(+id)

		this.purchaseable += this.isValidForPurchase()
			? 'A coupon cannot be purchased more than once'
			: 'Available only for customers'
	}
}
