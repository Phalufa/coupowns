import { Injectable } from '@angular/core'
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
	CanActivateChild
} from '@angular/router'
import { AuthService } from './auth.service'
import { ClientType } from 'src/app/models/client-type.enum'

@Injectable({
	providedIn: 'root'
})
export class CustomerAuthGuard implements CanActivate, CanActivateChild {
	constructor(private _authService: AuthService) {}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		let url: string = state.url
		return this.checkLogin()
	}

	checkLogin(): true | UrlTree {
		return this._authService.guard(ClientType.CUSTOMER)
	}

	canActivateChild(
		childRoute: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	) {
		return this.canActivate(childRoute, state)
	}
}
