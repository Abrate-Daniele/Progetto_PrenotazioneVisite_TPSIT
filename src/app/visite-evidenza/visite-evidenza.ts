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
    effect(async()=>{
      const user = this.authService.getCurrentUser();
      if (user?.role === 'paziente') {
        this.visiteDaPagare.set(await this.visiteService.getVisitaNonPagate(user.id));
      }
    })

  }

  async ngOnInit() {
  }

  pagaVisita(visita: Visita) {
    if (confirm(`Vuoi pagare € ${10} per la visita del ${this.formatDate(visita.data)}?`)) {
      this.visiteService.pagaVisita(visita.id);
      this.visiteDaPagare.update(visite =>
        visite.filter(v => v.id !== visita.id)
      );
      alert('Pagamento effettuato con successo');
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('it-IT');
  }

  formatTime(date: Date): string {
    const d = new Date(date);
    return d.getHours() + ':00';
  }
}
