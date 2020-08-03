import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CompanyComponent } from './company/company.component'
import { ManageCouponsComponent } from './manage-coupons/manage-coupons.component'
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component'
import { CompanyProfileComponent } from './company-profile/company-profile.component'
import { CompanyAuthGuard } from '../../services/auth/company-auth.guard'
import { CreateCouponComponent } from './create-coupon/create-coupon.component'
import { UpdateCouponComponent } from './update-coupon/update-coupon.component'

const routes: Routes = [
	{
		path: 'company',
		component: CompanyComponent,
		canActivate: [CompanyAuthGuard],
		children: [
			{
				path: '',
				canActivateChild: [CompanyAuthGuard],
				children: [
					{
						path: 'coupons',
						component: ManageCouponsComponent,
						canActivateChild: [CompanyAuthGuard],
						children: [
							{ path: 'new', component: CreateCouponComponent },
							{ path: 'update', component: UpdateCouponComponent }
						]
					},
					{ path: 'profile', component: CompanyProfileComponent },
					{ path: '', component: CompanyDashboardComponent }
				]
			}
		]
	}
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CompanyRoutingModule {}
