import { Injectable, signal } from '@angular/core';

export interface Visita {
  id: number;
  dataInizio: Date;
  dataFine: Date;
  slot: number; // 0-7 per orari 9:00-17:00
  pazienteId: number;
  pazienteNome: string;
  pazienteCognome: string;
  medicoId: number;
  medicoNome: string;
  medicoCognome: string;
  reparto: string;
  stato: 'prenotata' | 'completata' | 'cancellata';
  pagata: boolean;
  importo: number;
  note?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VisiteService {
  visite = signal<Visita[]>([
    {
      id: 1,
      dataInizio: new Date(2026, 2, 3, 9, 0),
      dataFine: new Date(2026, 2, 3, 10, 0),
      slot: 0,
      pazienteId: 1,
      pazienteNome: 'Mario',
      pazienteCognome: 'Rossi',
      medicoId: 10,
      medicoNome: 'Luigi',
      medicoCognome: 'Bianchi',
      reparto: 'Cardiologia',
      stato: 'prenotata',
      pagata: false,
      importo: 100
    },
    {
      id: 2,
      dataInizio: new Date(2026, 2, 4, 14, 0),
      dataFine: new Date(2026, 2, 4, 15, 0),
      slot: 5,
      pazienteId: 1,
      pazienteNome: 'Mario',
      pazienteCognome: 'Rossi',
      medicoId: 11,
      medicoNome: 'Anna',
      medicoCognome: 'Verdi',
      reparto: 'Dermatologia',
      stato: 'prenotata',
      pagata: true,
      importo: 80
    }
  ]);

  getVisiteByPaziente(pazienteId: number): Visita[] {
    // TODO: Collegare al server
    return this.visite().filter(v => v.pazienteId === pazienteId && v.stato !== 'cancellata');
  }

  getVisiteByMedico(medicoId: number): Visita[] {
    // TODO: Collegare al server
    return this.visite().filter(v => v.medicoId === medicoId && v.stato !== 'cancellata');
  }

  getVisiteByReparto(reparto: string): Visita[] {
    // TODO: Collegare al server
    return this.visite().filter(v => v.reparto === reparto && v.stato !== 'cancellata');
  }

  getVisitaNonPagate(pazienteId: number): Visita[] {
    // TODO: Collegare al server
    return this.visite().filter(
      v => v.pazienteId === pazienteId && !v.pagata && v.stato === 'prenotata'
    );
  }

  createVisita(visita: Omit<Visita, 'id'>): void {
    // TODO: Collegare al server
    const newVisita: Visita = {
      ...visita,
      id: Math.max(...this.visite().map(v => v.id), 0) + 1
    };
    this.visite.update(visite => [...visite, newVisita]);
  }

  updateVisita(id: number, updates: Partial<Visita>): void {
    // TODO: Collegare al server
    this.visite.update(visite =>
      visite.map(v => v.id === id ? { ...v, ...updates } : v)
    );
  }

  deleteVisita(id: number): void {
    // TODO: Collegare al server
    this.updateVisita(id, { stato: 'cancellata' });
  }

  pagaVisita(id: number): void {
    // TODO: Collegare al server
    this.updateVisita(id, { pagata: true });
  }

  getMediciByReparto(reparto: string): any[] {
    // TODO: Collegare al server
    return [
      { id: 10, nome: 'Luigi', cognome: 'Bianchi', reparto: 'Cardiologia' },
      { id: 11, nome: 'Anna', cognome: 'Verdi', reparto: 'Dermatologia' },
      { id: 12, nome: 'Marco', cognome: 'Neri', reparto: 'Cardiologia' }
    ].filter(m => m.reparto === reparto);
  }

  getTutiReparti(): string[] {
    // TODO: Collegare al server
    return ['Cardiologia', 'Dermatologia', 'Ortopedia', 'Neurologia'];
  }
}
