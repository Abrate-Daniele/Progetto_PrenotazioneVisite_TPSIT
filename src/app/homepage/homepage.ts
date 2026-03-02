import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserRole, User } from '../services/auth.service';
import { VisiteService, Visita } from '../services/visite.service';
import { User as UserComponent } from '../user/user';
import { Calendario } from '../calendario/calendario';
import { DettaglioVisita } from '../dettaglio-visita/dettaglio-visita';
import { VisiteEvidenza } from '../visite-evidenza/visite-evidenza';

@Component({
  selector: 'app-homepage',
  imports: [
    CommonModule,
    FormsModule,
    UserComponent,
    Calendario,
    DettaglioVisita,
    VisiteEvidenza,
  ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage implements OnInit {
  currentUser = signal<User | null>(null);
  userRole = signal<UserRole | null>(null);

  // Per i dettagli della visita
  selectedVisita = signal<Visita | null>(null);
  showDettaglioVisita = signal(false);
  isNewVisita = signal(false);

  // Per il calendario dell'admin
  selectedReparto = signal<string>('');
  reparti = signal<string[]>([]);
  visitaCalendario = signal<Visita[]>([]);

  constructor(
    private authService: AuthService,
    private visiteService: VisiteService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser.set(user);
    this.userRole.set(user.role);

    if (user.role === 'admin') {
      this.reparti.set(this.visiteService.getTutiReparti());
      if (this.reparti().length > 0) {
        this.selectedReparto.set(this.reparti()[0]);
        this.updateVisiteAdmin();
      }
    } else if (user.role === 'medico') {
      this.visitaCalendario.set(this.visiteService.getVisiteByMedico(user.id));
    } else if (user.role === 'paziente') {
      this.visitaCalendario.set(this.visiteService.getVisiteByPaziente(user.id));
    }
  }

  updateVisiteAdmin() {
    this.visitaCalendario.set(
      this.visiteService.getVisiteByReparto(this.selectedReparto())
    );
  }

  openNewVisita() {
    this.selectedVisita.set(null);
    this.isNewVisita.set(true);
    this.showDettaglioVisita.set(true);
  }

  openVisitaDetails(visita: Visita) {
    this.selectedVisita.set(visita);
    this.isNewVisita.set(false);
    this.showDettaglioVisita.set(true);
  }

  closeDettaglioVisita() {
    this.showDettaglioVisita.set(false);
    this.selectedVisita.set(null);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
