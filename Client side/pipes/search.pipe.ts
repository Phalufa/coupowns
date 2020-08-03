import { Pipe, PipeTransform } from '@angular/core'
import { Company } from 'src/app/models/company'
import { Customer } from '../models/customer'
import { Coupon } from '../models/coupon'

@Pipe({
	name: 'search'
})
export class SearchPipe implements PipeTransform {
	// search by names
	transform(value: any[], query: string): any[] {
		if (!value) return []
		if (!query) return value

		const queryCheck = (name: string): boolean => {
			return name.toLowerCase().startsWith(query.toLowerCase())
		}

		return value.filter(e => {
			if ((e as Coupon).title) return queryCheck((e as Coupon).title)
			else if ((e as Company).name) return queryCheck((e as Company).name)
			else if ((e as Customer).firstName) {
				const c = e as Customer
				return (
					queryCheck(`${c.firstName} ${c.lastName}`) ||
					queryCheck(`${c.lastName} ${c.firstName}`)
				)
			}
		})
	}
}
