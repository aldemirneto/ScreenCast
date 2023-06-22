import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ButtonLoading } from '../button-loading';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	public registerForm: FormGroup;

	constructor(_formBuilder: FormBuilder, private userService: UserService, private router: Router) {
		this.registerForm = _formBuilder.group({
			email: [null, Validators.required],
			password: [null, Validators.required]
		});
	}

	ngOnInit(): void {
	}

	register() {
		this.registerForm.controls['email'].markAsDirty();
		this.registerForm.controls['password'].markAsDirty();

		if (this.registerForm.invalid) {
			return;
		}

		const btn = document.getElementById('register-btn') as HTMLButtonElement;
		this.registerForm.disable();
		const btnLoading = new ButtonLoading(btn);

		this.userService.register(this.registerForm.value.email, this.registerForm.value.password).subscribe({
			next: () => {
				Swal.fire({
					icon: 'success',
					title: 'Registro bem sucedido! Faça login para continuar.',
					toast: true,
					position: 'top-end',
					timer: 3000,
					timerProgressBar: true,
					showConfirmButton: false
				})
				this.router.navigate(["/login"]);
			},
			error: (error) => {
				Swal.fire('Ocorreu um erro', error.error?.message ?? 'Não foi possível realizar o registro.', 'error');
			}
		}).add(() => {
			this.registerForm.enable();
			btnLoading.remove();
		});
	}
}
