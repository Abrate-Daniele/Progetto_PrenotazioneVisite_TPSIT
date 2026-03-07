import { Component, signal, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Visita, VisiteService } from '../services/visite.service';
import { AuthService } from '../services/auth.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dettaglio-visita',
  imports: [CommonModule, FormsModule],
  templateUrl: './dettaglio-visita.html',
  styleUrl: './dettaglio-visita.css',
})
export class DettaglioVisita {
  @Output() updateVisite = new EventEmitter<void>();

  visita = input<Visita | null>(null);
  isNewVisita = input(false);

  data: string = '';
  ora: number = 0;
  medico: number = 0;
  reparto: string = '';
  note: string = '';

  medici: any[] = [];
  reparti: string[] = [];
  slots_hours: any[] = [];

  allSlots = [
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
  ) {
    // Aggiorna le visite quando si aggiunge, modifica o elimina una visita
    effect(async () => {
      this.reparti = await this.visiteService.getTutiReparti();

      if (this.visita()) {
        const v = this.visita()!;
        this.data = typeof v.data === 'string' ? v.data : this.formatDate(v.data);
        this.ora = v.ora;
        this.medico = v.medicoId;
        this.reparto = v.reparto;
        this.note = v.note || '';
        await this.loadMedici(v.reparto);
      } else if (this.isNewVisita()) {
        const today = new Date();
        this.data = this.formatDate(today);
        this.ora = 0;
        if (this.reparti.length > 0) {
          this.reparto = this.reparti[0];
          await this.loadMedici(this.reparti[0]);
        }
      }
    });
  }

  async loadMedici(reparto: string) {
    this.medici = await this.visiteService.getMediciByReparto(reparto);

    if (this.medici.length > 0) {
      this.medico = this.medici[0].id;
      await this.loadSlotDisponibili();
    }
  }

  async loadSlotDisponibili() {
    if (this.medico && this.data) {
      const slotDisp = await this.visiteService.getSlotDisponibili(this.medico, this.data);
      this.slots_hours = slotDisp.map((slot: number) => ({
        value: slot,
        label: this.allSlots.find(s => s.value === slot)?.label || `${slot + 9}:00`
      }));
      this.ora = 0; // Reset slot quando carico nuovi slot
    }
  }

  onRepartoChange() {
    this.loadMedici(this.reparto);
  }

  onMedicoChange() {
    this.loadSlotDisponibili();
  }

  onDataChange() {
    this.loadSlotDisponibili();
  }

  isFormValid(): boolean {
    return this.data !== '' && this.reparto !== '' && this.medico !== 0;
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

  async saveVisita() {
    if (!this.data || !this.reparto || !this.medico) {
      alert('Compila tutti i campi obbligatori incluso lo slot orario');
      return;
    }

    if (this.visita()) {
      const dataInizio = this.parseDate(this.data);
      dataInizio.setHours(9 + this.ora);
      const successo = await this.visiteService.updateVisita(this.visita()!.idVis, {
        data: this.data,
        ora: this.ora,
        medicoId: this.medico,
        reparto: this.reparto,
        note: this.note,
      });

      if (successo) {
        alert('Visita aggiornata con successo');
        this.updateVisite.emit()
      } else {
        alert('Errore durante l\'aggiornamento della visita');
      }
    } else {
      const user = this.authService.getCurrentUser();
      if (!user || user.role !== 'paziente') {
        alert('Solo i pazienti possono prenotare visite');
        return;
      }

      const medico = this.medici.find(m => m.id === this.medico);

      const nuovaVisita: Omit<Visita, 'idVis'> = {
        data: this.data,
        ora: this.ora,
        pazienteId: user.id,
        pazienteNome: user.nome,
        pazienteCognome: user.cognome,
        medicoId: this.medico,
        medicoNome: medico?.nome || '',
        medicoCognome: medico?.cognome || '',
        reparto: this.reparto,
        stato: 'prenotata',
        pagata: false,
        importo: 100,
        note: this.note,
      };

      const successo = await this.visiteService.createVisita(nuovaVisita);
      if (successo) {
        alert('Visita prenotata con successo');
        this.updateVisite.emit()
      } else {
        alert('Errore durante la prenotazione della visita');
      }
    }
  }

  async deleteVisita() {
    if (this.visita()) {
      if (confirm('Sei sicuro di voler eliminare questa visita?')) {
        const successo = await this.visiteService.deleteVisita(this.visita()!.idVis);
        if (successo) {
          alert('Visita eliminata');
          this.updateVisite.emit()
        } else {
          alert('Errore durante l\'eliminazione della visita');
        }
      }
    }
  }

  cancel() {
  }
}
