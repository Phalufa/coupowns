import { Component, OnInit, OnDestroy } from '@angular/core'
import { Company } from 'src/app/models/company'
import { AdminService } from 'src/app/services/clients/admin.service'
import { take } from 'rxjs/operators'
import { OpenSnackBarService } from 'src/app/services/shared/open-snack-bar.service'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

@Component({
	selector: 'app-manage-companies',
	templateUrl: './manage-companies.component.html'
})
export class ManageCompaniesComponent implements OnInit, OnDestroy {
	companies: Company[]
	query: string = '' // user search text
	selectedCompany: Company
	companiesUpdates: Subscription

	constructor(
		private _service: AdminService,
		private _snackBarService: OpenSnackBarService,
		private _router: Router
	) {}

	ngOnInit(): void {
		this._service
			.getCompanies()
			.pipe(take(1))
			.subscribe(companies => (this.companies = companies))

		// apply changes to the company array
		this.onUpdates()
	}

	select(company: Company): void {
		// if user selects twice and did not understand what to do
		if (this.selectedCompany === company) {
			this._snackBarService.open(
				`Selected company: "${
					this._service.getSelectedCompany().name
				}". Choose an operation: DELETE, EDIT, CREATE`
			)
			return
		}
		this.selectedCompany = company
		this._service.setSelectedCompany(company)
		this._snackBarService.open(
			`Selected company: "${this._service.getSelectedCompany().name}"`
		)
	}

	add(): void {
		this._router.navigate(['admin/companies/new'])
	}

	edit(): void {
		this._router.navigate(['admin/companies/update'])
	}

	delete(company: Company): void {
		this._service
			.deleteCompany(company.id)
			.pipe(take(1))
			.subscribe(res => {
				this._snackBarService.open(res)
				this.companies.splice(this.companies.indexOf(company), 1)
				this._service.modifyCompany(null)
				this.selectedCompany = null
			})
	}

	// notify on each change in companies array
	onUpdates() {
		this.companiesUpdates = this._service
			.getModifiedCompany()
			.subscribe(company => {
				if (!company) return
				if (this.companies) {
					if (this.companies.length > 0) {
						const check = this.companies.find(c => c.id === company.id)
						if (check) {
							// company has been updated
							let i = this.companies.indexOf(check)
							this.companies[i] = company
						} else {
							// new company to add
							this.companies.push(company)
						}
					} else {
						// no companies yet, just push the new one:
						this.companies.push(company)
					}
				}
			})
	}

	ngOnDestroy(): void {
		this.companiesUpdates.unsubscribe()
	}
}
