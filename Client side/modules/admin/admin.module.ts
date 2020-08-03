import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AdminRoutingModule } from './admin-routing.module'
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component'
import { AdminComponent } from './admin/admin.component'
import { ManageCustomersComponent } from './manage-customers/manage-customers.component'
import { ManageCompaniesComponent } from './manage-companies/manage-companies.component'
import { SharedModule } from '../shared/shared.module'
import { CompanyDetailsComponent } from './company-details/company-details.component'
import { CreateCompanyComponent } from './create-company/create-company.component'
import { CreateCustomerComponent } from './create-customer/create-customer.component'
import { UpdateCustomerComponent } from './update-customer/update-customer.component'
import { UpdateCompanyComponent } from './update-company/update-company.component'
import { CustomerDetailsComponent } from './customer-details/customer-details.component'

@NgModule({
	declarations: [
		AdminDashboardComponent,
		AdminComponent,
		ManageCustomersComponent,
		ManageCompaniesComponent,
		CompanyDetailsComponent,
		CreateCompanyComponent,
		CreateCustomerComponent,
		UpdateCustomerComponent,
		UpdateCompanyComponent,
		CustomerDetailsComponent
	],
	exports: [
		AdminDashboardComponent,
		AdminComponent,
		ManageCustomersComponent,
		ManageCompaniesComponent
	],
	imports: [CommonModule, AdminRoutingModule, SharedModule]
})
export class AdminModule {}
