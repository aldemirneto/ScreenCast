import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { RecordingServiceService } from '../services/recording-service.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { catchError, last, map, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { env } from 'process';
import { environment } from 'src/environments/environment';
import { Recording } from '../models/recording.model';
import * as download from 'downloadjs';
import { ButtonLoading } from '../button-loading';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	public mediaRecorder: MediaRecorder | undefined;
	private recordedChunks: BlobPart[] = [];

	public startedAt: DateTime | undefined;

	public isServerRecording: boolean = false;

	public isUploading: boolean = false;
	public uploadProgress: number = 0;

	public showUploadSuccess: boolean = false;
	public hasBeenSaved: boolean = false;

	public recordingDuration: string = '00:00:00';

	public get isLoggedIn(): boolean {
		return this.tokenService.getJwtToken() !== null;
	}

	public get isSubscribed(): boolean {
		return this.tokenService.getUserInfo()?.isSubscribed ?? false;
	}

	public get userId(): string {
		return this.tokenService.getUserInfo()?.id ?? '';
	}

	public recordings: Recording[] = [];

	public recordMicForm: FormGroup;

	public baseUrl: string = environment.baseUrl;
	
	constructor(_formBuilder: FormBuilder, private recordingService: RecordingServiceService, private tokenService: TokenService, private userService: UserService) {
		this.recordMicForm = _formBuilder.group({
			recordMic: [false],
			echoCancellation: [true],
			noiseSuppression: [true],
		});
	}

	ngOnInit(): void {
		setInterval(() => {
			if (!this.startedAt) {
				this.recordingDuration = '00:00:00';
				return;
			}

			const duration = DateTime.now().diff(this.startedAt);
			this.recordingDuration = duration.toFormat('hh:mm:ss');
		}, 1000);

		if (this.isLoggedIn) {
			this.loadRecordings();		
		}
	}

	loadRecordings() {
		this.recordingService.getRecordings().subscribe({
			next: (recordings) => {
				this.recordings = recordings;
			},
			error: () => {
				Swal.fire('Ocorreu um erro', 'Não foi possível carregar as gravações', 'error');
			}
		});
	}

	async startRecording(isServerRecording: boolean) {
		this.isServerRecording = isServerRecording;
		this.showUploadSuccess = false;
		this.hasBeenSaved = false;
		
		let audioStreams: MediaStreamTrack[] = [];
		const micControls = this.recordMicForm.controls;
		if (micControls['recordMic'].value) {
			const mediaConstraints: MediaStreamConstraints = {
				audio: {
					echoCancellation: micControls['echoCancellation'].value,
					noiseSuppression: micControls['noiseSuppression'].value,
					sampleRate: 44100,
				}
			};

			try {
				audioStreams = (await navigator.mediaDevices.getUserMedia(mediaConstraints)).getTracks();
			} catch (error) {
				Swal.fire('Ocorreu um erro', 'Permissão para utilizar o microfone não concedida.', 'error');
				return;
			}
		}

		const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
		displayStream.addEventListener('inactive', () => {
			this.stopRecording();
		});

		this.recordedChunks = [];

		const combinedStream = new MediaStream([...displayStream.getTracks(), ...audioStreams]);

		this.mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm; codecs=vp9' });
		this.mediaRecorder.ondataavailable = (event) => {
			if (event.data && event.data.size > 0) {
				this.recordedChunks.push(event.data);
			}
		};
		this.mediaRecorder.onstop = this.stopRecording.bind(this);
		this.mediaRecorder.start(200);
		this.startedAt = DateTime.now();
	}

	saveRecording() {
		this.hasBeenSaved = true;
		const blob = new Blob(this.recordedChunks, { type: 'video/webm' });

		if (this.isServerRecording) {
			this.isUploading = true;
			this.uploadProgress = 0;

			this.recordingService.uploadFile(blob).pipe(
				tap(message => this.showProgress(message)),
				last(),
				catchError(error => {
					Swal.fire('Ocorreu um erro', error.error.message ?? 'Não foi possível salvar a gravação', 'error');
					this.isUploading = false;
					return error;
				})
				).subscribe({
					next: () => {
						console.log('upload complete');
						this.isUploading = false;
						this.showUploadSuccess = true;

						this.loadRecordings();
					}
				});
		} else {
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'screen-recording.webm';
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
		}
	}

	showProgress(message: HttpEvent<unknown>) {
		if (message.type == HttpEventType.UploadProgress) {
			const loaded = message.loaded;
			const total = message.total!;
			this.uploadProgress = Math.round(100 * loaded / total);
		}
	}

	stopRecording() {
		this.mediaRecorder?.stop();
		this.mediaRecorder?.stream.getTracks().forEach(track => track.stop());

		this.startedAt = undefined;

		if (!this.hasBeenSaved) {
			this.saveRecording();
		}
	}

	subscribe() {
		this.userService.subscribe().subscribe({
			next: () => {
				Swal.fire('Sucesso', 'Obrigado por assinar nosso serviço!', 'success');
				this.tokenService.setUserSubscribed();
			},
			error: (error) => {
				Swal.fire('Ocorreu um erro', 'Não possível assinar o serviço, tente novamente mais tarde.', 'error');
			}
		});
	}

	formatDate(date: string) {
		return DateTime.fromISO(date).toFormat('dd/MM/yyyy HH:mm:ss');
	}

	removeRecording(recording: Recording, button: HTMLButtonElement) {
		Swal.fire({
			title: 'Tem certeza?',
			text: 'Você não poderá reverter essa ação!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Remover',
			cancelButtonText: 'Cancelar'
		}).then((result) => {
			if (result.isConfirmed) {
				const btnLoading = new ButtonLoading(button);
				this.recordingService.removeRecording(recording.id).subscribe({
					next: () => {
						Swal.fire({
							icon: 'success',
							title: 'Gravação removida',
							toast: true,
							position: 'top-end',
							timer: 3000,
							timerProgressBar: true,
							showConfirmButton: false
						});

						const index = this.recordings.findIndex(r => r.id == recording.id);
						this.recordings.splice(index, 1);
						this.recordings = [...this.recordings];
					},
					error: () => {
						Swal.fire('Ocorreu um erro', 'Não foi possível remover a gravação.', 'error');
					}
				}).add(() => btnLoading.remove());
			}
		});
	}

	downloadRecording(recording: Recording, button: HTMLButtonElement) {
		const btnLoading = new ButtonLoading(button);
		
		this.recordingService.downloadRecording(recording.id, this.userId).pipe(
			last(),
			catchError(error => {
				Swal.fire('Ocorreu um erro', error.error.message ?? 'Não foi possível baixar a gravação', 'error');
				btnLoading.remove();
				return error;
			})
			).subscribe({
				next: (value: any) => {
					download(value.body, `${recording.createdAt}.webm`, "video/webm");
					btnLoading.remove();
				}
			});
	}
}
