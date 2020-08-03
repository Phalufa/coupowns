import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { CustomerRoutingModule } from './customer-routing.module'
import { CustomerComponent } from './customer/customer.component'
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component'
import { ManageCouponsComponent } from './manage-coupons/manage-coupons.component'
import { CustomerProfileComponent } from './customer-profile/customer-profile.component'
import { SharedModule } from '../shared/shared.module'

@NgModule({
	declarations: [
		CustomerComponent,
		CustomerDashboardComponent,
		ManageCouponsComponent,
		CustomerProfileComponent,
	],
	exports: [
		CustomerComponent,
		CustomerDashboardComponent,
		ManageCouponsComponent,
		CustomerProfileComponent
	],
	imports: [CommonModule, CustomerRoutingModule, SharedModule]
})
export class CustomerModule {}
