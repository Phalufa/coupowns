import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module'
import { LayoutComponent } from './components/web-layout/layout/layout.component'
import { MainComponent } from './components/web-layout/main/main.component'
import { HeaderComponent } from './components/web-layout/header/header.component'
import { GlobalNavBarComponent } from './components/web-layout/global-nav-bar/global-nav-bar.component'
import { HomeComponent } from './components/web-pages/home/home.component'
import { PageNotFoundComponent } from './components/web-pages/page-not-found/page-not-found.component'
import { LoginComponent } from './components/web-pages/login/login.component'
import { GlobalInterceptor } from './interceptors/global.interceptor'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import {
	MAT_RIPPLE_GLOBAL_OPTIONS,
	RippleGlobalOptions
} from '@angular/material/core'
import { AdminModule } from './modules/admin/admin.module'
import { CompanyModule } from './modules/company/company.module'
import { CustomerModule } from './modules/customer/customer.module'
import { SharedModule } from './modules/shared/shared.module'
import { CouponComponent } from './components/web-pages/coupon/coupon.component'

const globalRippleConfig: RippleGlobalOptions = {
	disabled: true
}

@NgModule({
	declarations: [
		LayoutComponent,
		MainComponent,
		HeaderComponent,
		GlobalNavBarComponent,
		HomeComponent,
		PageNotFoundComponent,
		LoginComponent,
		CouponComponent
	],
	imports: [
		BrowserModule,
		AdminModule,
		CompanyModule,
		CustomerModule,
		AppRoutingModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MatSnackBarModule,
		SharedModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: GlobalInterceptor,
			multi: true
		},
		{ provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig }
	],
	bootstrap: [LayoutComponent]
})
export class AppModule {}
