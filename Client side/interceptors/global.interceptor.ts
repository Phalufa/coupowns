import { Injectable } from '@angular/core'
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { LoadingService } from '../services/shared/loading.service'
import { catchError, finalize, delay } from 'rxjs/operators'
import { OpenSnackBarService } from '../services/shared/open-snack-bar.service'
import { AuthService } from '../services/auth/auth.service'

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {
	constructor(
		private _loadingService: LoadingService,
		private _snackBarService: OpenSnackBarService,
		private _authService: AuthService
	) {}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const authRequest = request.clone({
			headers: request.headers
		})

		this._loadingService.show() // loading spinner
		this._authService.updateSessionTimeout()

		return next.handle(authRequest).pipe(
			catchError((err: HttpErrorResponse) => {
				// all app error messages will be displayed
				this._snackBarService.open(err.error)

				if (err.status === 408 || err.status === 401) {
					localStorage.removeItem('token')
					window.location.href = '/signin'
				} else {
					throw new HttpErrorResponse({ error: err.error, status: err.status })
				}

				return throwError(err)
			}),
			delay(1000),
			finalize(() => {
				this._loadingService.hide()
			})
		)
	}
}
