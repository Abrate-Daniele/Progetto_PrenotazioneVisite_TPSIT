import { Injectable, signal } from '@angular/core';

export type UserRole = 'paziente' | 'medico' | 'admin';

export interface User {
  id: number;
  nome: string;
  cognome: string;
  mail: string;
  role: UserRole;
  reparto?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState = signal<AuthState>({
    isAuthenticated: false,
    user: null
  });

  async login(email: string, password: string, role: UserRole) {
    const response = await fetch('http://localhost:8081/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Importante: invia/riceve i cookie
      body: JSON.stringify({ email, password, role })
    });

    const data = await response.json();
    console.log(data)
    if (data.status == 'success') {
      this.authState.set({
        isAuthenticated: true,
        user: data.data
      });
      return false
    }
    else
      return true
  }

  register(nome: string, cognome: string, email: string, password: string, role: UserRole) {
    // TODO: Collegare al server per la registrazione
    // const response = await fetch('/api/auth/register', { ...})

    this.login(email, password, role);
  }

  logout() {
    // TODO: Collegare al server per il logout
    this.authState.set({
      isAuthenticated: false,
      user: null
    });
  }

  updateProfile(updates: Partial<User>) {
    // TODO: Collegare al server per l'aggiornamento del profilo
    const currentState = this.authState();
    if (currentState.user) {
      this.authState.set({
        ...currentState,
        user: { ...currentState.user, ...updates }
      });
    }
  }

  isAuthenticated(): boolean {
    return this.authState().isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.authState().user;
  }

  getCurrentRole(): UserRole | null {
    return this.authState().user?.role || null;
  }
}
