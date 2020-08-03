import { Component, OnInit } from '@angular/core'
import { CompanyService } from 'src/app/services/clients/company.service'
import { Coupon } from 'src/app/models/coupon'
import { take } from 'rxjs/operators'
import { Company } from 'src/app/models/company'
import {
	FormGroup,
	FormBuilder,
	AbstractControl,
	FormControl,
	Validators
} from '@angular/forms'
import { OpenSnackBarService } from 'src/app/services/shared/open-snack-bar.service'
import { NameValidator } from 'src/app/validators/name.directive'
import { Category } from 'src/app/models/category.enum'

@Component({
	selector: 'app-create-coupon',
	templateUrl: './create-coupon.component.html'
})
export class CreateCouponComponent implements OnInit {
	createForm: FormGroup
	selectedCoupon: Coupon
	categories = Category
	company: Company

	constructor(
		private _service: CompanyService,
		private _snackBarService: OpenSnackBarService,
		private _fb: FormBuilder
	) {}

	getC(control: string): AbstractControl {
		return this.createForm.get(control)
	}

	create() {
		let coupon: Coupon = {
			title: this.getC('title').value + ''.toLowerCase(),
			description: this.getC('description').value + ''.toLowerCase(),
			category: this.getC('category').value,
			startDate: this.getC('startDate').value,
			endDate: this.getC('endDate').value,
			amount: +this.getC('amount').value,
			price: +this.getC('price').value,
			company: this.company,
			image: ''
		}
		this._service
			.addCoupon(coupon)
			.pipe(take(1))
			.subscribe(res => {
				this._service.modifyCoupon(res)
				this._snackBarService.open(`${res.title} has been added`)
			})
	}

	ngOnInit(): void {
		this._service
			.getDetails()
			.pipe(take(1))
			.subscribe(res => (this.company = res))

		this.createForm = this._fb.group({
			title: new FormControl('', [
				NameValidator(/^([A-Za-z0-9])/),
				Validators.required
			]),
			description: new FormControl('', [
				NameValidator(/^([A-Za-z0-9])/),
				Validators.required
			]),
			category: new FormControl('', [Validators.required]),
			amount: new FormControl('', [Validators.min(1), Validators.required]),
			price: new FormControl('', [Validators.min(0), Validators.required]),
			startDate: new FormControl('', [Validators.required]),
			endDate: new FormControl('', [Validators.required])
		})
	}
}
