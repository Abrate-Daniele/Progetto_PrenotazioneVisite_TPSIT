import { Injectable, signal } from '@angular/core';

export interface Visita {
  id: number;
  dataInizio: Date;
  dataFine: Date;
  slot: number;
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
    },
    {
      id: 3,
      dataInizio: new Date(2026, 2, 5, 10, 0),
      dataFine: new Date(2026, 2, 5, 11, 0),
      slot: 1,
      pazienteId: 2,
      pazienteNome: 'Giovanna',
      pazienteCognome: 'Ferrari',
      medicoId: 12,
      medicoNome: 'Marco',
      medicoCognome: 'Neri',
      reparto: 'Cardiologia',
      stato: 'completata',
      pagata: true,
      importo: 100,
      note: 'Controllo pressione regolare'
    },
    {
      id: 4,
      dataInizio: new Date(2026, 2, 6, 11, 0),
      dataFine: new Date(2026, 2, 6, 12, 0),
      slot: 2,
      pazienteId: 3,
      pazienteNome: 'Paolo',
      pazienteCognome: 'Gallo',
      medicoId: 11,
      medicoNome: 'Anna',
      medicoCognome: 'Verdi',
      reparto: 'Dermatologia',
      stato: 'completata',
      pagata: true,
      importo: 80,
      note: 'Dermatite trattata'
    },
    {
      id: 5,
      dataInizio: new Date(2026, 2, 7, 15, 0),
      dataFine: new Date(2026, 2, 7, 16, 0),
      slot: 6,
      pazienteId: 2,
      pazienteNome: 'Giovanna',
      pazienteCognome: 'Ferrari',
      medicoId: 13,
      medicoNome: 'Roberto',
      medicoCognome: 'Russo',
      reparto: 'Ortopedia',
      stato: 'prenotata',
      pagata: false,
      importo: 120
    },
    {
      id: 6,
      dataInizio: new Date(2026, 2, 10, 9, 0),
      dataFine: new Date(2026, 2, 10, 10, 0),
      slot: 0,
      pazienteId: 4,
      pazienteNome: 'Francesca',
      pazienteCognome: 'Rizzo',
      medicoId: 14,
      medicoNome: 'Stefano',
      medicoCognome: 'Moretti',
      reparto: 'Neurologia',
      stato: 'prenotata',
      pagata: true,
      importo: 150
    },
    {
      id: 7,
      dataInizio: new Date(2026, 2, 11, 13, 0),
      dataFine: new Date(2026, 2, 11, 14, 0),
      slot: 4,
      pazienteId: 3,
      pazienteNome: 'Paolo',
      pazienteCognome: 'Gallo',
      medicoId: 12,
      medicoNome: 'Marco',
      medicoCognome: 'Neri',
      reparto: 'Cardiologia',
      stato: 'cancellata',
      pagata: false,
      importo: 100,
      note: 'Cancellata dal paziente'
    },
    {
      id: 8,
      dataInizio: new Date(2026, 2, 12, 16, 0),
      dataFine: new Date(2026, 2, 12, 17, 0),
      slot: 7,
      pazienteId: 1,
      pazienteNome: 'Mario',
      pazienteCognome: 'Rossi',
      medicoId: 13,
      medicoNome: 'Roberto',
      medicoCognome: 'Russo',
      reparto: 'Ortopedia',
      stato: 'prenotata',
      pagata: true,
      importo: 120
    },
    {
      id: 9,
      dataInizio: new Date(2026, 2, 13, 10, 0),
      dataFine: new Date(2026, 2, 13, 11, 0),
      slot: 1,
      pazienteId: 4,
      pazienteNome: 'Francesca',
      pazienteCognome: 'Rizzo',
      medicoId: 11,
      medicoNome: 'Anna',
      medicoCognome: 'Verdi',
      reparto: 'Dermatologia',
      stato: 'completata',
      pagata: true,
      importo: 80,
      note: 'Acne curata'
    },
    {
      id: 10,
      dataInizio: new Date(2026, 2, 14, 14, 0),
      dataFine: new Date(2026, 2, 14, 15, 0),
      slot: 5,
      pazienteId: 2,
      pazienteNome: 'Giovanna',
      pazienteCognome: 'Ferrari',
      medicoId: 14,
      medicoNome: 'Stefano',
      medicoCognome: 'Moretti',
      reparto: 'Neurologia',
      stato: 'prenotata',
      pagata: false,
      importo: 150
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
