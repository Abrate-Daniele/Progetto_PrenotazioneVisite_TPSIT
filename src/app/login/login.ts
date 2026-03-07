import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  isLoginMode = signal(true);
  loginForm: FormGroup;
  registerForm: FormGroup;
  errLogin = false;
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      role: ['paziente'],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      cognome: ['', [Validators.required, Validators.minLength(2)]],
      role: ['paziente', Validators.required],
      dataN: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Passa dalla modalità login alla modalità registrazione
  toggleMode() {
    this.isLoginMode.set(!this.isLoginMode());
    this.loginForm.reset({ role: 'paziente' });
    this.registerForm.reset({ role: 'paziente' });
    this.errLogin = false;
  }

  async login() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const { role, email, password } = this.loginForm.value;
      this.errLogin = await this.authService.login(email, password, role);
      this.isLoading.set(false);

      if (!this.errLogin) {
        this.router.navigate(['/homepage']);
      }
    }
  }

  async register() {
    if (this.registerForm.valid) {
      const { nome, cognome, role, email, password, confirmPassword, dataN } = this.registerForm.value;

      if (password !== confirmPassword) {
        alert('Le password non coincidono');
        return;
      }

      this.isLoading.set(true);
      const errRegister = await this.authService.register(nome, cognome, email, password, role, dataN);
      this.isLoading.set(false);

      if (!errRegister) {
        this.router.navigate(['/homepage']);
      } else {
        alert('Errore durante la registrazione');
      }
    }
  }
}
