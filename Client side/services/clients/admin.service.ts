import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, BehaviorSubject } from 'rxjs'
import { AuthService } from '../auth/auth.service'
import { Company } from '../../models/company'
import { Customer } from '../../models/customer'

@Injectable({
	providedIn: 'root'
})
export class AdminService {
	private url: string = '/user/admin/'
	private _selectedCompany: Company
	private _selectedCustomer: Customer
	private _companyModifier = new BehaviorSubject<Company>(this._selectedCompany)
	private _customerModifier = new BehaviorSubject<Customer>(
		this._selectedCustomer
	)

	constructor(private _http: HttpClient, private _service: AuthService) {}

	private getToken() {
		return this._service.getToken()
	}

	addCustomer(customer: Customer): Observable<Customer> {
		return this._http.post<Customer>(
			`${this.url}customer/${this.getToken()}`,
			customer
		)
	}

	getCustomer(id: number): Observable<Customer> {
		return this._http.get<Customer>(
			`${this.url}customer/${id}/${this.getToken()}`
		)
	}

	getCustomers(): Observable<Customer[]> {
		return this._http.get<Customer[]>(`${this.url}customer/${this.getToken()}`)
	}

	getCompany(id: number): Observable<Company> {
		return this._http.get<Company>(
			`${this.url}company/${id}/${this.getToken()}`
		)
	}

	getCompanies(): Observable<Company[]> {
		return this._http.get<Company[]>(`${this.url}company/${this.getToken()}`)
	}

	addCompany(company: Company): Observable<Company> {
		return this._http.post<Company>(
			`${this.url}company/${this.getToken()}`,
			company
		)
	}

	deleteCustomer(id: number) {
		return this._http.delete(`${this.url}customer/${id}/${this.getToken()}`, {
			responseType: 'text'
		})
	}

	deleteCompany(id: number) {
		return this._http.delete(`${this.url}company/${id}/${this.getToken()}`, {
			responseType: 'text'
		})
	}

	updateCustomer(customer: Customer): Observable<Customer> {
		return this._http.put<Customer>(
			`${this.url}customer/${this.getToken()}`,
			customer
		)
	}

	updateCompany(company: Company): Observable<Company> {
		return this._http.put<Company>(
			`${this.url}company/${this.getToken()}`,
			company
		)
	}

	setSelectedCompany(company: Company): void {
		this._selectedCompany = company
	}

	setSelectedCustomer(customer: Customer): void {
		this._selectedCustomer = customer
	}

	getSelectedCompany(): Company {
		return this._selectedCompany
	}

	getSelectedCustomer(): Customer {
		return this._selectedCustomer
	}

	getModifiedCompany() {
		return this._companyModifier.asObservable()
	}

	modifyCompany(company: Company) {
		this._companyModifier.next(company)
	}

	getModifiedCustomer() {
		return this._customerModifier.asObservable()
	}

	modifyCustomer(customer: Customer) {
		this._customerModifier.next(customer)
	}
}
