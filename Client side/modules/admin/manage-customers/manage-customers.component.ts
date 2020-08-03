import { Component, OnInit } from '@angular/core'
import { Customer } from 'src/app/models/customer'
import { Subscription } from 'rxjs'
import { AdminService } from 'src/app/services/clients/admin.service'
import { OpenSnackBarService } from 'src/app/services/shared/open-snack-bar.service'
import { Router } from '@angular/router'
import { take } from 'rxjs/operators'

@Component({
	selector: 'app-manage-customers',
	templateUrl: './manage-customers.component.html'
})
export class ManageCustomersComponent implements OnInit {
	customers: Customer[]
	query: string = '' // user search text
	selectedCustomer: Customer
	customersUpdates: Subscription

	constructor(
		private _service: AdminService,
		private _snackBarService: OpenSnackBarService,
		private _router: Router
	) {}

	ngOnInit(): void {
		this._service
			.getCustomers()
			.pipe(take(1))
			.subscribe(customers => (this.customers = customers))

		// apply changes to the customer array
		this.onUpdates()
	}

	select(customer: Customer): void {
		// if user selects twice and did not understand what to do
		if (this.selectedCustomer === customer) {
			this._snackBarService.open(
				`Selected customer: "${this._service.getSelectedCustomer().firstName} ${
					this._service.getSelectedCustomer().lastName
				}". Choose an operation: DELETE, EDIT, CREATE`
			)
			return
		}
		this.selectedCustomer = customer
		this._service.setSelectedCustomer(customer)
		this._snackBarService.open(
			`Selected customer: "${this._service.getSelectedCustomer().firstName} ${
				this._service.getSelectedCustomer().lastName
			}"`
		)
	}

	add(): void {
		this._router.navigate(['admin/customers/new'])
	}

	edit(): void {
		this._router.navigate(['admin/customers/update'])
	}

	delete(customer: Customer): void {
		this._service
			.deleteCustomer(customer.id)
			.pipe(take(1))
			.subscribe(res => {
				this._snackBarService.open(res)
				this.customers.splice(this.customers.indexOf(customer), 1)
				this._service.modifyCustomer(null)
				this.selectedCustomer = null
			})
	}

	// notify on each change in customers array
	onUpdates() {
		this.customersUpdates = this._service
			.getModifiedCustomer()
			.subscribe(customer => {
				if (!customer) return
				if (this.customers) {
					if (this.customers.length > 0) {
						const check = this.customers.find(c => c.id === customer.id)
						if (check) {
							// customer has been updated
							let i = this.customers.indexOf(check)
							this.customers[i] = customer
						} else {
							// new customer to add
							this.customers.push(customer)
						}
					} else {
						// no customers yet, just push the new one:
						this.customers.push(customer)
					}
				}
			})
	}

	ngOnDestroy(): void {
		this.customersUpdates.unsubscribe()
	}
}
