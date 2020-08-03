import {
	Component,
	OnInit,
	ViewChild,
	ElementRef,
	Renderer2
} from '@angular/core'
import { AdminService } from 'src/app/services/clients/admin.service'
import {
	FormControl,
	Validators,
	FormGroup,
	FormBuilder,
	AbstractControl
} from '@angular/forms'
import { NameValidator } from 'src/app/validators/name.directive'
import { Company } from 'src/app/models/company'
import { OpenSnackBarService } from 'src/app/services/shared/open-snack-bar.service'
import { take } from 'rxjs/operators'

@Component({
	selector: 'app-create-company',
	templateUrl: './create-company.component.html'
})
export class CreateCompanyComponent implements OnInit {
	createForm: FormGroup
	selectedCompany: Company
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
		let company: Company = {
			name: this.getC('name').value + ''.toLowerCase(),
			email: this.getC('email').value + ''.toLowerCase(),
			password: this.getC('password').value + ''
		}
		this._service
			.addCompany(company)
			.pipe(take(1))
			.subscribe(res => {
				this._service.modifyCompany(res)
				this._snackBarService.open(`${res.name} has been added`)
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
			name: new FormControl('', [NameValidator(/^([A-Za-z0-9])/)]),
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [
				Validators.required,
				Validators.minLength(4)
			])
		})
	}
}
