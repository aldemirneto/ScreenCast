import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Recording } from '../models/recording.model';

@Injectable({
	providedIn: 'root'
})
export class RecordingServiceService {

	private baseUrl: string = `${environment.baseUrl}/api/recording`;

	constructor(private http: HttpClient) { }

	getRecordings(): Observable<Recording[]> {
		return this.http.get<Recording[]>(this.baseUrl);
	}

	uploadFile(file: Blob) {
		const formData = new FormData();
		formData.append('file', file);

		const request = new HttpRequest('POST', this.baseUrl, formData, {
			reportProgress: true
		});
		return this.http.request(request);
	}

	removeRecording(id: string) {
		return this.http.delete(`${this.baseUrl}/${id}`);
	}
}
