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

  saveChanges() {
    const updates: Partial<UserInterface> = {
      nome: this.nome(),
      cognome: this.cognome(),
      mail: this.email(),
    };

    this.authService.updateProfile(updates);
    const updatedUser = this.authService.getCurrentUser();
    if (updatedUser) {
      this.user.set(updatedUser);
    }
    this.isEditing.set(false);
  }

  cancelEdit() {
    this.isEditing.set(false);
  }
}
