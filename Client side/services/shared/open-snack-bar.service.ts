import { Injectable } from '@angular/core'
import {
	MatSnackBar,
	MatSnackBarVerticalPosition
} from '@angular/material/snack-bar'

@Injectable({
	providedIn: 'root'
})
export class OpenSnackBarService {
	private DURATION: number = 4 * 1000
	private POSITION = 'top'
	private STYLE: string = 'snack'

	constructor(private _service: MatSnackBar) {}

	open(message: string): void {
		this._service.open(message, 'Close', {
			duration: this.DURATION,
			verticalPosition: <MatSnackBarVerticalPosition>this.POSITION,
			panelClass: this.STYLE
		})
	}
}
