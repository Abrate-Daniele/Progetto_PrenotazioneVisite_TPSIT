import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService} from './services/auth.service';
import { CommonModule } from '@angular/common';
import { Login } from "./login/login";
import { Homepage } from "./homepage/homepage";

@Component({
  selector: 'app-root',
  imports: [CommonModule, Login, Homepage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Progetto');

  constructor(private authService: AuthService, private router: Router) {}

  getUser(): any | null {
    return this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

