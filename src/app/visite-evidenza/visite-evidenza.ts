import { Component, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Visita, VisiteService } from '../services/visite.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-visite-evidenza',
  imports: [CommonModule],
  templateUrl: './visite-evidenza.html',
  styleUrl: './visite-evidenza.css',
})
export class VisiteEvidenza implements OnInit {
  visiteDaPagare = signal<Visita[]>([]);

  constructor(
    private visiteService: VisiteService,
    private authService: AuthService
  ) {
    effect(async () => {
      const user = this.authService.getCurrentUser();
      if (user?.role === 'paziente') {
        const visite = await this.visiteService.getVisitaNonPagate(user.id);
        this.visiteDaPagare.set(visite);
      }
    });
  }

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user?.role === 'paziente') {
      const visite = await this.visiteService.getVisitaNonPagate(user.id);
      this.visiteDaPagare.set(visite);
    }
  }

  async pagaVisita(visita: Visita) {
    if (confirm(`Vuoi pagare € ${visita.importo} per la visita del ${this.formatDate(visita.data)}?`)) {
      const successo = await this.visiteService.pagaVisita(visita.id);
      if (successo) {
        this.visiteDaPagare.update(visite =>
          visite.filter(v => v.id !== visita.id)
        );
        alert('Pagamento effettuato con successo');
      } else {
        alert('Errore durante il pagamento');
      }
    }
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('it-IT');
  }

  formatOra(ora: number): string {
    // ora è un indice da 0-7 che rappresenta le fasce orarie 9:00-17:00
    const startHour = 9 + ora;
    return `${startHour}:00 - ${startHour + 1}:00`;
  }
}
