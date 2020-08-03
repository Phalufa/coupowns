import {
	Component,
	OnInit,
	ViewChild,
	ElementRef,
	Renderer2
} from '@angular/core'
import { AdminService } from 'src/app/services/clients/admin.service'
import { OpenSnackBarService } from 'src/app/services/shared/open-snack-bar.service'
import { Company } from 'src/app/models/company'
import {
	FormBuilder,
	FormGroup,
	AbstractControl,
	FormControl,
	Validators
} from '@angular/forms'
import { Router } from '@angular/router'
import { take } from 'rxjs/operators'
import { NameValidator } from 'src/app/validators/name.directive'

@Component({
	selector: 'app-update-company',
	templateUrl: './update-company.component.html'
})
export class UpdateCompanyComponent implements OnInit {
	updateForm: FormGroup
	selectedCompany: Company
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
		let company: Company = {
			id: this.selectedCompany.id,
			name: this.getC('name').value + ''.toLowerCase(),
			email: this.getC('email').value + ''.toLowerCase(),
			password: this.getC('password').value + '',
			coupons: this.selectedCompany.coupons
		}
		this._service
			.updateCompany(company)
			.pipe(take(1))
			.subscribe(res => {
				this._snackBarService.open(`${res.name} has been updated`)
				this._service.setSelectedCompany(res)
				this._service.modifyCompany(res)
				this._router.navigate(['/admin/companies'])
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
		this.selectedCompany = this._service.getSelectedCompany()
		if (this.selectedCompany) {
			this.title = `Update ${this.selectedCompany.name}`
			this.updateForm = this._fb.group({
				name: new FormControl(this.selectedCompany.name, [
					NameValidator(/^([A-Za-z0-9])/),
					Validators.required
				]),
				email: new FormControl(this.selectedCompany.email, [
					Validators.required,
					Validators.email
				]),
				password: new FormControl(this.selectedCompany.password, [
					Validators.required,
					Validators.minLength(4)
				])
			})
		} else {
			this._router.navigate(['/admin/companies'])
		}
	}
}
