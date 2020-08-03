import {
	Component,
	OnInit,
	ViewChild,
	ElementRef,
	Renderer2
} from '@angular/core'
import {
	FormGroup,
	FormBuilder,
	AbstractControl,
	FormControl,
	Validators
} from '@angular/forms'
import { Customer } from 'src/app/models/customer'
import { AdminService } from 'src/app/services/clients/admin.service'
import { OpenSnackBarService } from 'src/app/services/shared/open-snack-bar.service'
import { Router } from '@angular/router'
import { take } from 'rxjs/operators'
import { NameValidator } from 'src/app/validators/name.directive'

@Component({
	selector: 'app-update-customer',
	templateUrl: './update-customer.component.html'
})
export class UpdateCustomerComponent implements OnInit {
	updateForm: FormGroup
	selectedCustomer: Customer
	@ViewChild('password') input: ElementRef
	reveal: string = 'Show'
	title: string

	constructor(
		private _service: AdminService,
		private _snackBarService: OpenSnackBarService,
		private _router: Router,
		private _fb: FormBuilder,
		private _renderer: Renderer2
	) {}

	getC(control: string): AbstractControl {
		return this.updateForm.get(control)
	}

	update() {
		let customer: Customer = {
			id: this.selectedCustomer.id,
			firstName: this.getC('firstName').value + ''.toLowerCase(),
			lastName: this.getC('lastName').value + ''.toLowerCase(),
			email: this.getC('email').value + ''.toLowerCase(),
			password: this.getC('password').value + '',
			coupons: this.selectedCustomer.coupons
		}
		this._service
			.updateCustomer(customer)
			.pipe(take(1))
			.subscribe(res => {
				this._snackBarService.open(
					`${res.firstName} ${res.lastName} has been updated`
				)
				this._service.setSelectedCustomer(res)
				this._service.modifyCustomer(res)
				this._router.navigate(['/admin/customers'])
			})
	}

	showPassword() {
		if (this.reveal === 'Show') {
			this._renderer.setAttribute(this.input.nativeElement, 'type', 'text')
			this.reveal = 'Hide'
		} else {
			this._renderer.setAttribute(this.input.nativeElement, 'type', 'password')
			this.reveal = 'Show'
		}
	}

	ngOnInit(): void {
		this.selectedCustomer = this._service.getSelectedCustomer()
		if (this.selectedCustomer) {
			this.title = `Update ${this.selectedCustomer.firstName} ${this.selectedCustomer.lastName}`
			this.updateForm = this._fb.group({
				firstName: new FormControl(this.selectedCustomer.firstName, [
					NameValidator(/(^[A-Za-z]*)$/),
					Validators.required
				]),
				lastName: new FormControl(this.selectedCustomer.lastName, [
					NameValidator(/(^[A-Za-z]*)$/),
					Validators.required
				]),
				email: new FormControl(this.selectedCustomer.email, [
					Validators.required,
					Validators.email
				]),
				password: new FormControl(this.selectedCustomer.password, [
					Validators.required,
					Validators.minLength(4)
				])
			})
		} else {
			this._router.navigate(['/admin/customers'])
		}
	}
}
