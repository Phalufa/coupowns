import { Coupon } from './coupon'

export interface Customer {
	id?: number
	firstName: string
	lastName: string
	email: string
	password: string
	coupons?: Coupon[]
}
