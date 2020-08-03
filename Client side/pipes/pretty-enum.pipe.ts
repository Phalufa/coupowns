import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
	name: 'prettyEnum'
})
export class PrettyEnumPipe implements PipeTransform {
	transform(value: Object): string {
		return value.toString().split('_').join(' ').toLowerCase()
	}
}
