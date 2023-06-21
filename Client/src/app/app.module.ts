import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCashRegister, faCheck, faCircleStop, faCloudArrowUp, faComputer, faHouseLaptop, faServer, faVideo, faWallet } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		HeaderComponent,
  LoginComponent,
  RegisterComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		FontAwesomeModule,
		NgbModule,
		HttpClientModule,
		ReactiveFormsModule
	],
	providers: [
		AuthInterceptor,
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(
			faVideo,
			faComputer,
			faServer,
			faCloudArrowUp,
			faHouseLaptop,
			faCircleStop,
			faCheck,
			faWallet,
			faCashRegister,
		)
	}
}
