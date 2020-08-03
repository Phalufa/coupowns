import { Component, OnInit } from '@angular/core'
import { Category } from 'src/app/models/category.enum'
import { GuestService } from 'src/app/services/clients/guest.service'
import { Observable } from 'rxjs'
import { Coupon } from 'src/app/models/coupon'
import { Router } from '@angular/router'
import { take } from 'rxjs/operators'

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	categories = Category // Category enum
	coupons$: Observable<Coupon[]>
	placeholders: string[] = []

	constructor(private _service: GuestService, private _router: Router) {}

	ngOnInit(): void {
		this.coupons$ = this._service.getAllCoupons()

		/* Filling  Placeholders Images */
		this.coupons$.pipe(take(1)).subscribe(coupons => {
			for (const coupon of coupons) {
				this.placeholders.push(this.randImage())
			}
		})
	}

	viewCouponPage(id: number) {
		this._router.navigate(['/coupons', id], { skipLocationChange: true })
	}

	viewCategory(category: Category) {
		if (category) this.coupons$ = this._service.getCouponsByCategory(category)
		else this.coupons$ = this._service.getAllCoupons()
	}

	/* Images Just For Placeholders */
	randImage(): string {
		const rand = Math.floor(Math.random() * 70) + 1
		return 'https://i.pravatar.cc/350?img=' + rand // avatar placeholder images
	}
}
