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
  // Utente e ruolo correnti
  currentUser = signal<User | null>(null);
  userRole = signal<UserRole | null>(null);

  selectedVisita = signal<Visita | null>(null);
  showDettaglioVisita = signal(false);
  isNewVisita = signal(false);

  selectedReparto = signal<string>('');
  reparti = signal<string[]>([]);
  visitaCalendario = signal<Visita[]>([]);

  reloadVisiteEvidenza = signal(0);

  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private visiteService: VisiteService,
    private router: Router
  ) {}

  // Inizializza la dashboard a seconda del ruolo
  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser.set(user);
    this.userRole.set(user.role);
    this.isLoading.set(true);

    if (user.role === 'admin') {
      this.reparti.set(await this.visiteService.getTutiReparti());
      if (this.reparti().length > 0) {
        this.selectedReparto.set(this.reparti()[0]);
        await this.updateVisiteAdmin();
      }
    } else if (user.role === 'medico') {
      this.visitaCalendario.set(await this.visiteService.getVisiteByMedico(user.id));
    } else if (user.role === 'paziente') {
      this.visitaCalendario.set(await this.visiteService.getVisiteByPaziente(user.id));
    }

    this.isLoading.set(false);
  }

  // Ricarica le visite del calendario per paziente/medico
  async updateVisite() {
    const user = this.authService.getCurrentUser();
    if (user?.role === 'paziente') {
      const visite = await this.visiteService.getVisiteByPaziente(user.id);
      this.visitaCalendario.set(visite);
    } else if (user?.role === 'medico') {
      const visite = await this.visiteService.getVisiteByMedico(user.id);
      this.visitaCalendario.set(visite);
    }

    this.reloadVisiteEvidenza.update(v => v + 1);
  }


  // Ricarica le visite del calendario per l'admin in base al reparto
  async updateVisiteAdmin() {
    const visite = await this.visiteService.getVisiteByReparto(this.selectedReparto());
    this.visitaCalendario.set(visite);

    this.reloadVisiteEvidenza.update(v => v + 1);
  }

  // Gestisce apertura chiusura modale dettaglio visita
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

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
