import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class RecordingServiceService {

	private baseUrl: string = `${environment.baseUrl}/api/recording`;

	constructor(private http: HttpClient) { }

	getRecordings(): Observable<{ id: string, createdAt: string }[]> {
		return this.http.get<{ id: string, createdAt: string }[]>(this.baseUrl);
	}

	uploadFile(file: Blob) {
		const formData = new FormData();
		formData.append('file', file);

		const request = new HttpRequest('POST', this.baseUrl, formData, {
			reportProgress: true
		});
		return this.http.request(request);
	}
}
