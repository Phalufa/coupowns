import { Component, Renderer2, ViewChild, ElementRef } from '@angular/core'
import { AuthService } from 'src/app/services/auth/auth.service'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
	selector: 'app-global-nav-bar',
	templateUrl: './global-nav-bar.component.html'
})
export class GlobalNavBarComponent {
	isLogged$: Observable<boolean>
	open: boolean
	@ViewChild('menu') menu: ElementRef<HTMLElement>

	constructor(
		private _service: AuthService,
		private _route: Router,
		private _snackBarService: MatSnackBar,
		private _renderer: Renderer2
	) {
		this.isLogged$ = _service.isLogged()
	}

	getRole(): string {
		const role = this._service.getRole()
		return role == null ? 'signin' : role.toLowerCase()
	}

	logout(): void {
		this._snackBarService.open("You've been logged out", 'Close', {
			duration: 3000,
			verticalPosition: 'top',
			panelClass: 'snack'
		})
		this._service.logout()
		this._route.navigate(['/home'])
	}

	toggleMenu() {
		this.open
			? this._renderer.addClass(this.menu.nativeElement, 'hide')
			: this._renderer.removeClass(this.menu.nativeElement, 'hide')
		this.open = !this.open
	}
}
