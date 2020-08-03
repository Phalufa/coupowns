import { ValidatorFn, AbstractControl } from '@angular/forms'

export function NameValidator(nameRe: RegExp): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const reg = nameRe.test(control.value)
		return !reg ? { invalidName: { value: control.value } } : null
	}
}
