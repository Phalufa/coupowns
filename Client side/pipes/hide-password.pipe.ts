import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
	name: 'hidePassword'
})
export class HidePasswordPipe implements PipeTransform {
	transform(password: string): string {
		let hiddenPassword: string = ''
		for (let i of password) {
			hiddenPassword += '*'
		}
		return hiddenPassword
	}
}
