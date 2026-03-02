import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

@Component({
  selector: 'login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  isLoginMode = signal(true);
  selectedRole = signal<UserRole>('paziente');

  // Campi del form di login
  loginEmail = signal('');
  loginPassword = signal('');

  // Campi del form di registrazione
  regNome = signal('');
  regCognome = signal('');
  regEmail = signal('');
  regPassword = signal('');
  regConfirmPassword = signal('');
  regRole = signal<UserRole>('paziente');

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode() {
    this.isLoginMode.set(!this.isLoginMode());
    this.clearForm();
  }

  login() {
    if (!this.loginEmail() || !this.loginPassword()) {
      alert('Compila tutti i campi');
      return;
    }

    this.authService.login(this.loginEmail(), this.loginPassword(), this.selectedRole());
    this.router.navigate(['/homepage']);
  }

  register() {
    if (
      !this.regNome() ||
      !this.regCognome() ||
      !this.regEmail() ||
      !this.regPassword() ||
      !this.regConfirmPassword()
    ) {
      alert('Compila tutti i campi');
      return;
    }

    if (this.regPassword() !== this.regConfirmPassword()) {
      alert('Le password non corrispondono');
      return;
    }

    this.authService.register(
      this.regNome(),
      this.regCognome(),
      this.regEmail(),
      this.regPassword(),
      this.regRole()
    );

    this.router.navigate(['/homepage']);
  }

  clearForm() {
    this.loginEmail.set('');
    this.loginPassword.set('');
    this.regNome.set('');
    this.regCognome.set('');
    this.regEmail.set('');
    this.regPassword.set('');
    this.regConfirmPassword.set('');
  }
}
