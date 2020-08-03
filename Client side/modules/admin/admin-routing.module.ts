import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component'
import { ManageCompaniesComponent } from './manage-companies/manage-companies.component'
import { ManageCustomersComponent } from './manage-customers/manage-customers.component'
import { AdminComponent } from './admin/admin.component'
import { AdminAuthGuard } from '../../services/auth/admin-auth.guard'
import { CreateCompanyComponent } from './create-company/create-company.component'
import { CreateCustomerComponent } from './create-customer/create-customer.component'
import { UpdateCompanyComponent } from './update-company/update-company.component'
import { UpdateCustomerComponent } from './update-customer/update-customer.component'

const adminRoutes: Routes = [
	{
		path: 'admin',
		component: AdminComponent,
		canActivate: [AdminAuthGuard],
		children: [
			{
				path: '',
				canActivateChild: [AdminAuthGuard],
				children: [
					{
						path: 'companies',
						component: ManageCompaniesComponent,
						canActivateChild: [AdminAuthGuard],
						children: [
							{ path: 'new', component: CreateCompanyComponent },
							{ path: 'update', component: UpdateCompanyComponent }
						]
					},
					{
						path: 'customers',
						component: ManageCustomersComponent,
						canActivateChild: [AdminAuthGuard],
						children: [
							{ path: 'new', component: CreateCustomerComponent },
							{ path: 'update', component: UpdateCustomerComponent }
						]
					},
					{ path: '', component: AdminDashboardComponent }
				]
			}
		]
	}
]

@NgModule({
	imports: [RouterModule.forChild(adminRoutes)],
	exports: [RouterModule]
})
export class AdminRoutingModule {}
