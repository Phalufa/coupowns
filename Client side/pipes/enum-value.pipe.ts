import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
	name: 'enumValue'
})
export class EnumValuePipe implements PipeTransform {
	transform(value: Object): string[] {
		return Object.values(value)
	}
}
