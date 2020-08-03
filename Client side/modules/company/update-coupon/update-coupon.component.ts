import { Component, OnInit } from '@angular/core'
import { Category } from 'src/app/models/category.enum'
import { Coupon } from 'src/app/models/coupon'
import {
	FormGroup,
	FormBuilder,
	AbstractControl,
	FormControl,
	Validators
} from '@angular/forms'
import { CompanyService } from 'src/app/services/clients/company.service'
import { OpenSnackBarService } from 'src/app/services/shared/open-snack-bar.service'
import { Router } from '@angular/router'
import { take } from 'rxjs/operators'
import { NameValidator } from 'src/app/validators/name.directive'

@Component({
	selector: 'app-update-coupon',
	templateUrl: './update-coupon.component.html'
})
export class UpdateCouponComponent implements OnInit {
	updateForm: FormGroup
	selectedCoupon: Coupon
	categories = Category
	title: string
	selectedCouponCategory

	constructor(
		private _service: CompanyService,
		private _snackBarService: OpenSnackBarService,
		private _router: Router,
		private _fb: FormBuilder
	) {}

	getC(control: string): AbstractControl {
		if (this.updateForm == undefined) return
		return this.updateForm.get(control)
	}

	update() {
		let coupon: Coupon = {
			id: this.selectedCoupon.id,
			title: this.getC('title').value + ''.toLowerCase(),
			description: this.getC('description').value + ''.toLowerCase(),
			category: this.getC('category').value,
			startDate: this.getC('startDate').value,
			endDate: this.getC('endDate').value,
			amount: +this.getC('amount').value,
			price: +this.getC('price').value,
			company: this.selectedCoupon.company,
			image: this.selectedCoupon.image
		}
		this._service
			.updateCoupon(coupon)
			.pipe(take(1))
			.subscribe(res => {
				this._snackBarService.open(`${res.title} has been updated`)
				this._service.setSelectedCoupon(res)
				this._service.modifyCoupon(res)
				this._router.navigate(['/company/coupons'])
			})
	}

	ngOnInit(): void {
		this.selectedCoupon = this._service.getSelectedCoupon()
		let coup = this.selectedCoupon
		if (coup) {
			this.title = `Update ${coup.title}`
			this.updateForm = this._fb.group({
				title: new FormControl(coup.title, [
					NameValidator(/^([A-Za-z0-9])/),
					Validators.required
				]),
				description: new FormControl(coup.description, [
					NameValidator(/^([A-Za-z0-9])/),
					Validators.required
				]),
				category: new FormControl(coup.category, [Validators.required]),
				amount: new FormControl(coup.amount, [
					Validators.min(1),
					Validators.required
				]),
				price: new FormControl(coup.price, [
					Validators.min(0),
					Validators.required
				]),
				startDate: new FormControl(coup.startDate, [Validators.required]),
				endDate: new FormControl(coup.endDate, [Validators.required])
			})
		} else {
			this._router.navigate(['/company/coupons'])
		}

		this.selectedCouponCategory = Object.values(this.selectedCoupon.category)
	}
}
