import { Component, OnInit } from '@angular/core'
import { CompanyService } from 'src/app/services/clients/company.service'
import { Company } from 'src/app/models/company'
import { Observable } from 'rxjs'
import { Coupon } from 'src/app/models/coupon'
import { Category } from 'src/app/models/category.enum'

@Component({
	selector: 'app-company-profile',
	templateUrl: './company-profile.component.html'
})
export class CompanyProfileComponent implements OnInit {
	companyDetails$: Observable<Company>
	companyNumOfCoupons$: Observable<Coupon[]>
	categories = Category

	constructor(private _service: CompanyService) {}

	ngOnInit(): void {
		this.companyDetails$ = this._service.getDetails()
		this.companyNumOfCoupons$ = this._service.getCoupons()
	}

	filterCoupons(coupons: Coupon[], category: Category) {
		return coupons.filter(coupon => coupon.category == category)
	}
}
