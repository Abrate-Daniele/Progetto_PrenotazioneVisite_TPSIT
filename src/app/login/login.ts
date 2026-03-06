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
  errLogin:boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Crea il form di login
    this.loginForm = this.fb.group({
      role: ['paziente'],
      email: ['',  [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Crea il form di registrazione
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      cognome: ['', [Validators.required, Validators.minLength(2)]],
      role: ['paziente', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleMode() {
    this.isLoginMode.set(!this.isLoginMode());
    this.loginForm.reset({ role: 'paziente' });
    this.registerForm.reset({ role: 'paziente' });
  }

  async login() {

    if(this.loginForm.valid)
    {
      const { role, email, password } = this.loginForm.value;
      this.errLogin = await this.authService.login(email, password, role);

    }
  }

  register() {
    if(this.registerForm.valid)
    {
      const { nome, cognome, role, email, password } = this.registerForm.value;
      this.authService.register(nome, cognome, email, password, role);
    }
  }
}
