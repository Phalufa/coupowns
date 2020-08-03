import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HomeComponent } from './components/web-pages/home/home.component'
import { PageNotFoundComponent } from './components/web-pages/page-not-found/page-not-found.component'
import { LoginComponent } from './components/web-pages/login/login.component'
import { CouponComponent } from './components/web-pages/coupon/coupon.component'

const routes: Routes = [
	{ path: 'home', component: HomeComponent },
	{ path: 'signin', component: LoginComponent },
	{ path: 'coupons/:id', component: CouponComponent },
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: '**', component: PageNotFoundComponent }
]

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: false })],
	exports: [RouterModule]
})
export class AppRoutingModule {}
