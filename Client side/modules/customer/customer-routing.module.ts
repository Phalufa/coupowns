import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CustomerComponent } from './customer/customer.component'
import { CustomerProfileComponent } from './customer-profile/customer-profile.component'
import { ManageCouponsComponent } from './manage-coupons/manage-coupons.component'
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component'
import { CustomerAuthGuard } from '../../services/auth/customer-auth.guard'

const routes: Routes = [
	{
		path: 'customer',
		component: CustomerComponent,
		canActivate: [CustomerAuthGuard],
		children: [
			{
				path: '',
				canActivateChild: [CustomerAuthGuard],
				children: [
					{ path: 'profile', component: CustomerProfileComponent },
					{ path: 'coupons', component: ManageCouponsComponent },
					{ path: '', component: CustomerDashboardComponent }
				]
			}
		]
	}
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CustomerRoutingModule {}
