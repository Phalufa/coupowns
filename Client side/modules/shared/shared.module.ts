import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HidePasswordPipe } from '../../pipes/hide-password.pipe'
import { EnumValuePipe } from '../../pipes/enum-value.pipe'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { PrettyEnumPipe } from 'src/app/pipes/pretty-enum.pipe'
import { LoadingComponent } from './loading/loading.component'
import { CouponDetailsComponent } from './coupon-details/coupon-details.component'
import { SearchPipe } from 'src/app/pipes/search.pipe'

@NgModule({
	declarations: [
		HidePasswordPipe,
		EnumValuePipe,
		PrettyEnumPipe,
		SearchPipe,
		CouponDetailsComponent,
		LoadingComponent
	],
	exports: [
		HidePasswordPipe,
		EnumValuePipe,
		PrettyEnumPipe,
		SearchPipe,
		ReactiveFormsModule,
		FormsModule,
		LoadingComponent,
		CouponDetailsComponent
	],
	imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class SharedModule {}
