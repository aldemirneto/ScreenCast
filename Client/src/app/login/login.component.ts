import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ButtonLoading } from '../button-loading';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TokenService } from '../services/token.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	public loginForm: FormGroup;

	constructor(_formBuilder: FormBuilder, private userService: UserService, private router: Router, private tokenService: TokenService) {
		this.loginForm = _formBuilder.group({
			email: [null, Validators.required],
			password: [null, Validators.required]
		});
	}

	ngOnInit(): void {
	}

	login() {
		this.loginForm.controls['email'].markAsDirty();
		this.loginForm.controls['password'].markAsDirty();

		if (this.loginForm.invalid) {
			return;
		}

		const btn = document.getElementById('login-btn') as HTMLButtonElement;
		this.loginForm.disable();
		const btnLoading = new ButtonLoading(btn);

		this.userService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
			next: (response) => {
				this.tokenService.saveJwtToken(response.accessToken, response.expiresAt);
				
				Swal.fire({
					icon: 'success',
					title: 'Login bem sucedido!',
					toast: true,
					position: 'top-end',
					timer: 3000,
					timerProgressBar: true,
					showConfirmButton: false
				});
				this.router.navigate(["/"]);
			},
			error: (error) => {
				Swal.fire('Ocorreu um erro', error.error?.message ?? 'Não foi possível realizar o login.', 'error');
			}
		}).add(() => {
			this.loginForm.enable();
			btnLoading.remove();
		});
	}
}
