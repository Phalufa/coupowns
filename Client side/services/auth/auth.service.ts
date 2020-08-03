import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'
import { ClientType } from 'src/app/models/client-type.enum'
import { OpenSnackBarService } from '../shared/open-snack-bar.service'
import { take, map } from 'rxjs/operators'
import { Router, UrlTree } from '@angular/router'

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	isLogged$ = new BehaviorSubject<boolean>(this.hasToken())
	private SESSION_TIMEOUT: number = 30 * 60 * 1000

	constructor(
		private _http: HttpClient,
		private _snackBarService: OpenSnackBarService,
		private _router: Router
	) {}

	private hasToken(): boolean {
		return localStorage.getItem('token') != null
	}

	// returns the client type
	getRole(): string | null {
		const token = localStorage.getItem('token')
		return token != null
			? window.atob(
					token.substring(
						token.lastIndexOf('role:') + 5,
						token.lastIndexOf('time:')
					)
			  )
			: null
	}

	// returns true if the session time ended or null if there is no token
	isTimeOut(): boolean | null {
		if (this.getSessionTimeout())
			return Date.now() - this.getSessionTimeout() < this.SESSION_TIMEOUT
				? false
				: true

		return null
	}

	// returns the time in millis or null if there is no token
	getSessionTimeout(): number | null {
		const token = localStorage.getItem('token')
		if (token != null) {
			return +token.substring(token.lastIndexOf('time:') + 5, token.length - 1)
		}
		return null
	}

	updateSessionTimeout(): void {
		if (this.getSessionTimeout()) {
			const updateTimeout = this.getSessionTimeout() + this.SESSION_TIMEOUT
			localStorage.setItem(
				'token',
				`{${this.getToken()}role:${btoa(this.getRole())}time:${updateTimeout}}`
			)
		}
	}

	// returns the UUID token
	getToken(): string | null {
		const token = localStorage.getItem('token')
		return token != null ? token.substring(1, 37) : null
	}

	login(email: string, password: string, client: string): Observable<string> {
		return this._http.post<any>(`/login/${email}/${password}/${client}`, {
			responseType: 'text'
		})
	}

	logout(): void {
		this._http.post<any>(`/logout/token`, this.getToken())
		this.isLogged$.next(false)
		localStorage.removeItem('token')
	}

	// returns the login state of the client (logged in)
	isLogged(): Observable<boolean> {
		return this.isLogged$.asObservable()
	}

	// app routes guard, checks for user login state
	guard(role: ClientType): true | UrlTree {
		let redirect: boolean = false

		this.isLogged()
			.pipe(
				take(1),
				map(isLoggedIn => {
					// user is logged in and has permission to navigate the route
					if (isLoggedIn && !this.isTimeOut() && this.getRole() === role)
						return true

					// user was logged in, but session timeout
					if (this.isTimeOut() && role) {
						this._snackBarService.open('Session timeout, please re-log')
						localStorage.removeItem('token')
						this.isLogged$.next(false)
					}
					// user needs to be redirected to login page
					redirect = true
				})
			)
			.subscribe()

		return redirect ? this._router.parseUrl('/signin') : true
	}
}
