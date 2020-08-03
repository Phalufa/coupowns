import { Component, Input } from '@angular/core'
import { Coupon } from 'src/app/models/coupon'

@Component({
	selector: 'app-coupon-details',
	templateUrl: './coupon-details.component.html'
})
export class CouponDetailsComponent {
	@Input() coupon: Coupon
	@Input() index: number
	@Input() showCompany: boolean
	@Input() showAmount: boolean

	placeholder = this.randImage();
	
	/* Images Just For Placeholders */
	randImage(): string {
		const rand = Math.floor(Math.random() * 70) + 1
		return 'https://i.pravatar.cc/175?img=' + rand // avatar placeholder images
	}
}
