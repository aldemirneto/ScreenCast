import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	private baseUrl: string = `${environment.baseUrl}/api/user`;

	constructor(private http: HttpClient) { }

	login(email: string, password: string): Observable<{ createdAt: string, expiresAt: string, accessToken: string }> {
		const body = { email, password };
		return this.http.post<{ createdAt: string, expiresAt: string, accessToken: string }>(`${this.baseUrl}/login`, body);
	}

	register(email: string, password: string) {
		const body = { email, password };
		return this.http.post(`${this.baseUrl}`, body);
	}

	subscribe() {
		return this.http.put(`${this.baseUrl}`, null);
	}
}
