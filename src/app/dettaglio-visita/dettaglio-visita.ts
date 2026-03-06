import { Component, signal, input, effect } from '@angular/core';
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
export class DettaglioVisita {
  visita = input<Visita | null>(null);
  isNewVisita = input(false);

  // Campi del form
  data: string = '';
  ora: number = 0;
  medico: number = 0;
  reparto: string = '';
  note: string = '';

  medici: any[] = [];
  reparti: string[] = [];
  slots_hours: any[] = [];

  // Slot orari di default (per riferimento)
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
    effect(async () => {
      console.log(this.visita)
      this.reparti = await this.visiteService.getTutiReparti();

      if (this.visita()) {
        // Modalità di modifica
        const v = this.visita()!;
        this.data = typeof v.data === 'string' ? v.data : this.formatDate(v.data);
        this.ora = v.ora;
        this.medico = v.medicoId;
        this.reparto = v.reparto;
        this.note = v.note || '';
        this.loadMedici(v.reparto);
      } else if (this.isNewVisita()) {
        // Modalità di creazione
        const today = new Date();
        this.data = this.formatDate(today);
        this.ora = 0;
        if (this.reparti.length > 0) {
          this.reparto = this.reparti[0];
          this.loadMedici(this.reparti[0]);
        }
      }
    });
  }

  async loadMedici(reparto: string) {
    this.medici = await this.visiteService.getMediciByReparto(reparto);
    
    if (this.medici.length > 0) {
      this.medico = this.medici[0].id;
      // Carica gli slot disponibili per il medico selezionato
      await this.loadSlotDisponibili();
    }
  }

  async loadSlotDisponibili() {
    if (this.medico && this.data) {
      const slotDisp = await this.visiteService.getSlotDisponibili(this.medico, this.data);
      // Mappa gli slot disponibili con le loro etichette
      this.slots_hours = slotDisp.map((slot: any) => ({
        value: slot.value !== undefined ? slot.value : slot,
        label: this.allSlots.find(s => s.value === (slot.value !== undefined ? slot.value : slot))?.label || `${slot}:00`
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

  saveVisita() {
    if (!this.data || !this.reparto || !this.medico || this.ora === 0) {
      alert('Compila tutti i campi obbligatori incluso lo slot orario');
      return;
    }

    if (this.visita()) {
      // Aggiorna una visita esistente
      // TODO: Validare che la data non sia nel passato
      const dataInizio = this.parseDate(this.data);
      dataInizio.setHours(9 + this.ora);

      const dataFine = new Date(dataInizio);
      dataFine.setHours(dataFine.getHours() + 1);

      this.visiteService.updateVisita(this.visita()!.id, {
        data: this.parseDate(this.data),
        ora: this.ora,
        medicoId: this.medico,
        reparto: this.reparto,
        note: this.note,
      });

      alert('Visita aggiornata con successo');
    } else {
      // Crea una nuova visita
      const dataInizio = this.parseDate(this.data);
      dataInizio.setHours(9 + this.ora);

      const dataFine = new Date(dataInizio);
      dataFine.setHours(dataFine.getHours() + 1);

      const user = this.authService.getCurrentUser();
      if (!user || user.role !== 'paziente') {
        alert('Solo i pazienti possono prenotare visite');
        return;
      }

      const medico = this.medici.find(m => m.id === this.medico);

      const nuovaVisita: Omit<Visita, 'id'> = {
        data: this.parseDate(this.data),
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
        importo: 100, // Non usato nel database, mantiene per compatibilità
        note: this.note,
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
