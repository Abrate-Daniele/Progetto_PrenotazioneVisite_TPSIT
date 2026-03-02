import { Component, signal, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Visita, VisiteService } from '../services/visite.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dettaglio-visita',
  imports: [CommonModule, FormsModule],
  templateUrl: './dettaglio-visita.html',
  styleUrl: './dettaglio-visita.css',
})
export class DettaglioVisita implements OnInit {
  visita = input<Visita | null>(null);
  isNewVisita = input(false);

  // Campi del form
  data = signal<string>('');
  slot = signal<number>(0);
  medico = signal<number>(0);
  reparto = signal<string>('');
  note = signal<string>('');

  medici: any[] = [];
  reparti: string[] = [];
  slots = Array.from({ length: 8 }, (_, i) => ({ value: i, label: (9 + i) + ':00' }));

  // Slot orari in formato leggibile
  slots_hours = [
    { value: 0, label: '09:00 - 10:00' },
    { value: 1, label: '10:00 - 11:00' },
    { value: 2, label: '11:00 - 12:00' },
    { value: 3, label: '12:00 - 13:00' },
    { value: 4, label: '13:00 - 14:00' },
    { value: 5, label: '14:00 - 15:00' },
    { value: 6, label: '15:00 - 16:00' },
    { value: 7, label: '16:00 - 17:00' },
  ];

  constructor(
    private visiteService: VisiteService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.reparti = this.visiteService.getTutiReparti();

    if (this.visita()) {
      // Modalità di modifica
      const v = this.visita()!;
      this.data.set(this.formatDate(v.dataInizio));
      this.slot.set(v.slot);
      this.medico.set(v.medicoId);
      this.reparto.set(v.reparto);
      this.note.set(v.note || '');
      this.loadMedici(v.reparto);
    } else if (this.isNewVisita()) {
      // Modalità di creazione
      const today = new Date();
      this.data.set(this.formatDate(today));
      this.slot.set(0);
      if (this.reparti.length > 0) {
        this.reparto.set(this.reparti[0]);
        this.loadMedici(this.reparti[0]);
      }
    }
  }

  loadMedici(reparto: string) {
    this.medici = this.visiteService.getMediciByReparto(reparto);
    if (this.medici.length > 0) {
      this.medico.set(this.medici[0].id);
    }
  }

  onRepartoChange() {
    this.loadMedici(this.reparto());
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  parseDate(dateString: string): Date {
    return new Date(dateString + 'T00:00:00');
  }

  saveVisita() {
    if (!this.data() || !this.reparto() || !this.medico()) {
      alert('Compila tutti i campi obbligatori');
      return;
    }

    if (this.visita()) {
      // Aggiorna una visita esistente
      // TODO: Validare che la data non sia nel passato
      const dataInizio = this.parseDate(this.data());
      dataInizio.setHours(9 + this.slot());

      const dataFine = new Date(dataInizio);
      dataFine.setHours(dataFine.getHours() + 1);

      this.visiteService.updateVisita(this.visita()!.id, {
        dataInizio,
        dataFine,
        slot: this.slot(),
        medicoId: this.medico(),
        reparto: this.reparto(),
        note: this.note(),
      });

      alert('Visita aggiornata con successo');
    } else {
      // Crea una nuova visita
      const dataInizio = this.parseDate(this.data());
      dataInizio.setHours(9 + this.slot());

      const dataFine = new Date(dataInizio);
      dataFine.setHours(dataFine.getHours() + 1);

      const user = this.authService.getCurrentUser();
      if (!user || user.role !== 'paziente') {
        alert('Solo i pazienti possono prenotare visite');
        return;
      }

      const medico = this.medici.find(m => m.id === this.medico());

      const nuovaVisita: Omit<Visita, 'id'> = {
        dataInizio,
        dataFine,
        slot: this.slot(),
        pazienteId: user.id,
        pazienteNome: user.nome,
        pazienteCognome: user.cognome,
        medicoId: this.medico(),
        medicoNome: medico?.nome || '',
        medicoCognome: medico?.cognome || '',
        reparto: this.reparto(),
        stato: 'prenotata',
        pagata: false,
        importo: 100,
        note: this.note(),
      };

      this.visiteService.createVisita(nuovaVisita);
      alert('Visita prenotata con successo');
    }
  }

  deleteVisita() {
    if (this.visita()) {
      if (confirm('Sei sicuro di voler eliminare questa visita?')) {
        this.visiteService.deleteVisita(this.visita()!.id);
        alert('Visita eliminata');
      }
    }
  }

  cancel() {
    // TODO: Chiudere la modale o tornare indietro
  }
}
