import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { CompanyRoutingModule } from './company-routing.module'
import { CompanyComponent } from './company/company.component'
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component'
import { ManageCouponsComponent } from './manage-coupons/manage-coupons.component'
import { CompanyProfileComponent } from './company-profile/company-profile.component'
import { SharedModule } from '../shared/shared.module'
import { CreateCouponComponent } from './create-coupon/create-coupon.component'
import { UpdateCouponComponent } from './update-coupon/update-coupon.component'

@NgModule({
	declarations: [
		CompanyComponent,
		CompanyDashboardComponent,
		ManageCouponsComponent,
		CompanyProfileComponent,
		CreateCouponComponent,
		UpdateCouponComponent
	],
	exports: [
		CompanyComponent,
		CompanyDashboardComponent,
		ManageCouponsComponent
	],
	imports: [CommonModule, CompanyRoutingModule, SharedModule]
})
export class CompanyModule {}
