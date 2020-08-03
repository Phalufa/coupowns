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
import { take } from 'rxjs/operators'
import { NameValidator } from 'src/app/validators/name.directive'

@Component({
	selector: 'app-create-customer',
	templateUrl: './create-customer.component.html'
})
export class CreateCustomerComponent implements OnInit {
	createForm: FormGroup
	selectedCustomer: Customer
	@ViewChild('password') input: ElementRef
	reveal: string = 'Show'

	constructor(
		private _service: AdminService,
		private _snackBarService: OpenSnackBarService,
		private _fb: FormBuilder,
		private _renderer: Renderer2
	) {}

	getC(control: string): AbstractControl {
		return this.createForm.get(control)
	}

	create() {
		let customer: Customer = {
			firstName: this.getC('firstName').value + ''.toLowerCase(),
			lastName: this.getC('lastName').value + ''.toLowerCase(),
			email: this.getC('email').value + ''.toLowerCase(),
			password: this.getC('password').value + ''
		}
		this._service
			.addCustomer(customer)
			.pipe(take(1))
			.subscribe(res => {
				this._service.modifyCustomer(res)
				this._snackBarService.open(
					`${res.firstName} ${res.lastName} has been added`
				)
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
		this.createForm = this._fb.group({
			firstName: new FormControl('', [
				NameValidator(/(^[A-Za-z]*)$/),
				Validators.required
			]),
			lastName: new FormControl('', [
				NameValidator(/(^[A-Za-z]*)$/),
				Validators.required
			]),
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [
				Validators.required,
				Validators.minLength(4)
			])
		})
	}
}
