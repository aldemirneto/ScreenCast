import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
	providedIn: 'root'
})
export class TokenService {
	private readonly SESSION_TOKEN = "session_token";
	private readonly USER_INFO = "user_info";

	constructor(private cookieService: CookieService) { }

	signOut(): void {
		this.cookieService.delete(this.SESSION_TOKEN, '/');
		this.cookieService.delete(this.USER_INFO, '/');
	}

	saveJwtToken(token: string, expiration: string): void {
		const expirationDate: Date = new Date(expiration);
		this.cookieService.delete(this.SESSION_TOKEN, '/');
		this.cookieService.set(this.SESSION_TOKEN, token, { path: '/', expires: expirationDate, sameSite: "Strict", secure: true });
		this.saveUserInfo(expirationDate);
	}

	getJwtToken(): string | null {
		return this.cookieService.get(this.SESSION_TOKEN) == "" ? null : this.cookieService.get(this.SESSION_TOKEN);
	}
	
	saveUserInfo(expiration: Date): void {
		const token: string | null = this.cookieService.get(this.SESSION_TOKEN);
		if (token == null) {
			return;
		}

		const payload: any = jwtDecode(token);

		const userModel = {
			id: payload.nameid,
			isSubscribed: payload.role === "True",
		};

		this.cookieService.delete(this.USER_INFO, '/');
		this.cookieService.set(this.USER_INFO, JSON.stringify(userModel), { path: '/', expires: expiration, sameSite: "Strict", secure: true });
	}

	getUserInfo(): { id: string, isSubscribed: false } | null {
		const info = this.cookieService.get(this.USER_INFO);
		if (info === "" || info === null) {
			return null;
		}
		return <{ id: string, isSubscribed: false }>JSON.parse(info);
	}

	setUserSubscribed() {
		const token: string | null = this.cookieService.get(this.SESSION_TOKEN);
		if (token == null) {
			return;
		}

		const payload: any = jwtDecode(token);

		const expiration: Date = new Date(payload.exp * 1000);

		const userModel = {
			id: this.getUserInfo()?.id,
			isSubscribed: true,
		};

		this.cookieService.delete(this.USER_INFO, '/');
		this.cookieService.set(this.USER_INFO, JSON.stringify(userModel), { path: '/', expires: expiration, sameSite: "Strict", secure: true });
	}
}
