import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import * as signalR from '@microsoft/signalr';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	public mediaRecorder: MediaRecorder | undefined;
	private recordedChunks: BlobPart[] = [];

	public startedAt: DateTime | undefined;

	private hubConnection: signalR.HubConnection | undefined;

	public get recordingDuration(): string {
		if (!this.startedAt) {
			return '00:00:00';
		}

		const duration = DateTime.now().diff(this.startedAt);
		return duration.toFormat('hh:mm:ss');
	}
	
	constructor() { }

	ngOnInit(): void {
		setInterval(() => {
			this.startedAt = this.startedAt;
		}, 1000);
	}

	startRecording() {
		navigator.mediaDevices.getDisplayMedia({ video: true })
			.then((stream: MediaStream) => {
				this.recordedChunks = [];

				this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
				this.mediaRecorder.ondataavailable = (event) => {
					if (event.data && event.data.size > 0) {
						console.log(`pushing data`)
						this.recordedChunks.push(event.data);

						this.saveRecording();
					}
				};
				this.mediaRecorder.start();
				this.startedAt = DateTime.now();
			})
			.catch((error) => {
				console.error('Error accessing media devices.', error);
			});
	}

	saveRecording() {
		const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'screen-recording.webm';
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
	}

	stopRecording() {
		this.mediaRecorder?.stop();
		this.mediaRecorder?.stream.getTracks().forEach(track => track.stop());
		
		this.startedAt = undefined;
	}
}
