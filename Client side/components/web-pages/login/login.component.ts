import { Component, OnInit } from '@angular/core'
import {
	FormBuilder,
	FormGroup,
	AbstractControl,
	FormControl,
	Validators
} from '@angular/forms'
import { ClientType } from 'src/app/models/client-type.enum'
import { AuthService } from 'src/app/services/auth/auth.service'
import { Router } from '@angular/router'
import { OpenSnackBarService } from 'src/app/services/shared/open-snack-bar.service'
import { take } from 'rxjs/operators'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup
	clientType = ClientType

	constructor(
		private _service: AuthService,
		private _fb: FormBuilder,
		private _route: Router,
		private _snackBarService: OpenSnackBarService
	) {}

	getC(control: string): AbstractControl {
		return this.loginForm.get(control)
	}

	login() {
		this._service
			.login(
				this.getC('email').value + ''.toLowerCase(),
				this.getC('password').value + '',
				this.getC('client').value
			)
			.pipe(take(1))
			.subscribe(token => {
				localStorage.setItem('token', token)

				// redirect the user by its client type
				const role = this._service.getRole()
				switch (role) {
					case 'ADMIN':
						this._route.navigate(['/admin'])
						break
					case 'COMPANY':
						this._route.navigate(['/company'])
						break
					case 'CUSTOMER':
						this._route.navigate(['/customer'])
						break
				}
				// hide login link and view logout & dashboard links
				this._service.isLogged$.next(true)
				this._snackBarService.open('Welcome back')
			})
	}

	ngOnInit(): void {
		this.loginForm = this._fb.group({
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [
				Validators.required,
				Validators.minLength(4)
			]),
			client: new FormControl('', [Validators.required])
		})
	}
}
