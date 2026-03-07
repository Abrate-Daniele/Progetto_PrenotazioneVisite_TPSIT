import { Component, signal, OnInit, effect, Output, EventEmitter, Input } from '@angular/core';
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
  @Output() updateVisite = new EventEmitter<void>();
  visiteDaPagare = signal<Visita[]>([]);

  private reloadSignal = signal(0);

  @Input() set reloadToken(value: number) {
    this.reloadSignal.set(value);
  }

  constructor(
    private visiteService: VisiteService,
    private authService: AuthService
  ) {
    // Quando cambia il token o l'utente, ricarica le visite non pagate
    effect(async () => {
      const _ = this.reloadSignal();
      const user = this.authService.getCurrentUser();
      if (user?.role === 'paziente') {
        const visite = await this.visiteService.getVisitaNonPagate(user.id);
        this.visiteDaPagare.set(visite);
      }
    });
  }

  // Mostra le visite non pagate e permette il pagamento rapido
  async ngOnInit() {}

  async pagaVisita(visita: Visita) {
    if (confirm(`Vuoi pagare € ${visita.importo} per la visita del ${this.formatDate(visita.data)}?`)) {
      const successo = await this.visiteService.pagaVisita(visita.idVis);
      if (successo) {
        this.visiteDaPagare.update(visite =>
          visite.filter(v => v.idVis !== visita.idVis)
        );
        alert('Pagamento effettuato con successo');
        this.updateVisite.emit()
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
