import { Coupon } from './coupon'

export interface Company {
	id?: number
	coupons?: Coupon[]
	name: string
	email: string
	password: string
}
