import { Injectable, signal } from '@angular/core';

export interface Visita {
  id: number;
  data: Date;
  ora: number;
  pazienteId: number;
  pazienteNome: string;
  pazienteCognome: string;
  medicoId: number;
  medicoNome: string;
  medicoCognome: string;
  reparto: string;
  stato: string;
  pagata: boolean;
  importo: number;
  note?: string;
}

@Injectable({
  providedIn: 'root'
})

export class VisiteService {
  visite = signal<Visita[]>([])

  async getVisiteByPaziente(pazienteId: number): Promise<Visita[]> {
    const response = await fetch(`http://localhost:8081/getVisiteByPaziente`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ pazienteId })
    });

    const data = await response.json();
    console.log(data)
    if (data.status === 'success') {
      return data.data;
    }
    return [];
  }

  async getVisiteByMedico(medicoId: number): Promise<Visita[]> {
    const response = await fetch(`http://localhost:8081/getVisiteByMedico`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ medicoId })
    });

    const data = await response.json();
    console.log(data)
    if (data.status === 'success') {
      return data.data;
    }
    return [];
  }

  async getVisiteByReparto(reparto: string): Promise<Visita[]> {
    const response = await fetch(`http://localhost:8081/getVisiteByReparto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ reparto })
    });

    const data = await response.json();
    console.log(data)
    if (data.status === 'success') {
      return data.data;
    }
    return [];
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
