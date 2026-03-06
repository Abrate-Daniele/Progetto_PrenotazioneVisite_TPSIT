import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User as UserInterface } from '../services/auth.service';

@Component({
  selector: 'app-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit {
  isEditing = signal(false);
  user = signal<UserInterface | null>(null);
  isLoading = signal(false);

  // Campi del form
  nome = signal('');
  cognome = signal('');
  email = signal('');
  telefono = signal('');

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user.set(currentUser);
      this.nome.set(currentUser.nome);
      this.cognome.set(currentUser.cognome);
      this.email.set(currentUser.mail);
    }
  }

  toggleEdit() {
    this.isEditing.set(!this.isEditing());
    if (this.isEditing()) {
      const user = this.user();
      if (user) {
        this.nome.set(user.nome);
        this.cognome.set(user.cognome);
        this.email.set(user.mail);
      }
    }
  }

  async saveChanges() {
    const updates: Partial<UserInterface> = {
      nome: this.nome(),
      cognome: this.cognome(),
      mail: this.email(),
    };

    this.isLoading.set(true);
    const successo = await this.authService.updateProfile(updates);
    this.isLoading.set(false);

    if (successo) {
      const updatedUser = this.authService.getCurrentUser();
      if (updatedUser) {
        this.user.set(updatedUser);
      }
      this.isEditing.set(false);
      alert('Profilo aggiornato con successo');
    } else {
      alert('Errore durante l\'aggiornamento del profilo');
    }
  }

  cancelEdit() {
    this.isEditing.set(false);
    // Ripristina i valori originali
    const user = this.user();
    if (user) {
      this.nome.set(user.nome);
      this.cognome.set(user.cognome);
      this.email.set(user.mail);
    }
  }
}
