import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	private mediaRecorder: MediaRecorder | undefined;
	private recordedChunks: BlobPart[] = [];
	
	constructor() { }

	ngOnInit(): void {
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
					}
				};
				this.mediaRecorder.start();
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
	}
}
