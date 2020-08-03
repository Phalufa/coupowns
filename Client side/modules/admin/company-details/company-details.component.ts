import { Component, Input } from '@angular/core'
import { Company } from 'src/app/models/company'

@Component({
	selector: 'app-company-details',
	templateUrl: './company-details.component.html'
})
export class CompanyDetailsComponent {
	@Input() company: Company
	@Input() index: number
}
