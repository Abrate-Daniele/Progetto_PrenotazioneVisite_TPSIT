import { Injectable, signal } from '@angular/core';

export type UserRole = 'paziente' | 'medico' | 'admin';

export interface User {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  role: UserRole;
  reparto?: string;
  specializzazione?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState = signal<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  login(email: string, password: string, role: UserRole) {
    // TODO: Collegare al server per effettuare il login
    // const response = await fetch('/api/auth/login', { ...})
    
    // Simulazione login con dati mock
    const mockUser: User = {
      id: 1,
      nome: 'Mario',
      cognome: 'Rossi',
      email: email,
      telefono: '3201234567',
      role: role,
      reparto: role === 'medico' ? 'Cardiologia' : undefined,
      specializzazione: role === 'medico' ? 'Cardiologia' : undefined
    };

    this.authState.set({
      isAuthenticated: true,
      user: mockUser,
      token: 'mock-token-' + Date.now()
    });
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
      user: null,
      token: null
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
