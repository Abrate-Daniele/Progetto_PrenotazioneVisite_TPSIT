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
  private readonly API_URL = 'http://localhost:8081';

  authState = signal<AuthState>({
    isAuthenticated: false,
    user: null
  });

  // Effettua il login e salva l'utente corrente nello stato
  async login(email: string, password: string, role: UserRole): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, role })
      });

      const data = await response.json();
      if (data.status === 'success') {
        this.authState.set({
          isAuthenticated: true,
          user: data.data
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error('Errore login:', error);
      return true;
    }
  }

  // Registra un nuovo paziente e lo autentica
  async register(
    nome: string,
    cognome: string,
    email: string,
    password: string,
    role: UserRole,
    dataN: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nome, cognome, email, password, role, dataN })
      });

      const data = await response.json();
      if (data.status === 'success') {
        this.authState.set({
          isAuthenticated: true,
          user: data.data
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error('Errore registrazione:', error);
      return true;
    }
  }

  // Esegue il logout e pulisce lo stato locale
  async logout(): Promise<void> {
    try {
      await fetch(`${this.API_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Errore logout:', error);
    } finally {
      this.authState.set({
        isAuthenticated: false,
        user: null
      });
    }
  }

  async updateProfile(updates: Partial<User>): Promise<boolean> {
    try {
      const currentState = this.authState();
      if (!currentState.user) return false;

      const response = await fetch(`${this.API_URL}/updateProfile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          id: currentState.user.id, 
          role: currentState.user.role,
          ...updates 
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        this.authState.set({
          ...currentState,
          user: { ...currentState.user, ...updates }
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Errore aggiornamento profilo:', error);
      return false;
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
