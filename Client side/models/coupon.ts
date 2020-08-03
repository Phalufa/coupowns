import { Company } from './company'
import { Category } from './category.enum'

export interface Coupon {
	id?: number
	company: Company
	category: Category
	title: string
	description: string
	startDate: Date
	endDate: Date
	amount: number
	price: number
	image?: string
}
