import { Injectable } from '@angular/core'
import { EntityType } from 'src/app/models/entity-type.enum'

@Injectable({
	providedIn: 'root'
})
/******  
@deprecated
Recplaced with the 'Search' pipe
******/
export class SearchService {
	onSearch(query: string, entityArray: any[], entityType: EntityType) {
		if (query) {
			const queryCheck = (name: string): boolean => {
				return name.toLowerCase().startsWith(query.toLowerCase())
			}
			if (entityArray) {
				switch (entityType) {
					case EntityType.COMPANY:
						return entityArray.filter(company => {
							return queryCheck(company.name)
						})
					case EntityType.CUSTOMER:
						return entityArray.filter(customer => {
							return (
								queryCheck(`${customer.firstName} ${customer.lastName}`) ||
								queryCheck(`${customer.lastName} ${customer.firstName}`)
							)
						})
					case EntityType.COUPON:
						return entityArray.filter(coupon => {
							return queryCheck(coupon.title)
						})
				}
			}
		}
	}
}
