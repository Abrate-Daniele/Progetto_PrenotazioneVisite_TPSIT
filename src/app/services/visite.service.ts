import { Injectable, signal } from '@angular/core';

export interface Visita {
  idVis: number;
  data: string;
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
  private readonly API_URL = 'http://localhost:8081';
  visite = signal<Visita[]>([]);

  async getVisiteByPaziente(pazienteId: number): Promise<Visita[]> {
    try {
      const response = await fetch(`${this.API_URL}/getVisiteByPaziente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pazienteId })
      });

      const data = await response.json();
      console.log('Visite paziente:', data);
      if (data.status === 'success') {
        return data.data;
      }
    } catch (error) {
      console.error('Errore getVisiteByPaziente:', error);
    }
    return [];
  }

  async getVisiteByMedico(medicoId: number): Promise<Visita[]> {
    try {
      const response = await fetch(`${this.API_URL}/getVisiteByMedico`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ medicoId })
      });

      const data = await response.json();
      console.log('Visite medico:', data);
      if (data.status === 'success') {
        return data.data;
      }
    } catch (error) {
      console.error('Errore getVisiteByMedico:', error);
    }
    return [];
  }

  async getVisiteByReparto(reparto: string): Promise<Visita[]> {
    try {
      const response = await fetch(`${this.API_URL}/getVisiteByReparto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reparto })
      });

      const data = await response.json();
      console.log('Visite reparto:', data);
      if (data.status === 'success') {
        return data.data;
      }
    } catch (error) {
      console.error('Errore getVisiteByReparto:', error);
    }
    return [];
  }

  async getVisitaNonPagate(pazienteId: number): Promise<Visita[]> {
    try {
      const response = await fetch(`${this.API_URL}/getVisiteByPazienteNP`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pazienteId })
      });

      const data = await response.json();
      console.log('Visite non pagate:', data);
      if (data.status === 'success') {
        return data.data;
      }
    } catch (error) {
      console.error('Errore getVisitaNonPagate:', error);
    }
    return [];
  }

  async createVisita(visita: Omit<Visita, 'idVis'>): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/createVisita`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(visita)
      });

      const data = await response.json();
      console.log('Create visita:', data);
      if (data.status === 'success') {
        // Ricarica le visite del paziente per aggiornare il signal
        const visite = await this.getVisiteByPaziente(visita.pazienteId);
        this.visite.set(visite);
        return true;
      }
    } catch (error) {
      console.error('Errore createVisita:', error);
    }
    return false;
  }

  async updateVisita(id: number, updates: Partial<Visita>): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/updateVisita`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, ...updates })
      });

      const data = await response.json();
      console.log('Update visita:', data);
      if (data.status === 'success') {
        // Aggiorna il signal locale
        this.visite.update(visite =>
          visite.map(v => v.idVis === id ? { ...v, ...updates } : v)
        );
        return true;
      }
    } catch (error) {
      console.error('Errore updateVisita:', error);
    }
    return false;
  }

  async deleteVisita(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/deleteVisita`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      console.log('Delete visita:', data);
      if (data.status === 'success') {
        this.visite.update(visite =>
          visite.filter(v => v.idVis !== id)
        );
        return true;
      }
    } catch (error) {
      console.error('Errore deleteVisita:', error);
    }
    return false;
  }

  async pagaVisita(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/pagaVisita`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      console.log('Paga visita:', data);
      if (data.status === 'success') {
        this.visite.update(visite =>
          visite.map(v => v.idVis === id ? { ...v, pagata: true } : v)
        );
        return true;
      }
    } catch (error) {
      console.error('Errore pagaVisita:', error);
    }
    return false;
  }

  async getMediciByReparto(reparto: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_URL}/getMediciByReparto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reparto })
      });

      const data = await response.json();
      console.log('Medici reparto:', data);
      if (data.status === 'success') {
        return data.data;
      }
    } catch (error) {
      console.error('Errore getMediciByReparto:', error);
    }
    return [];
  }

  async getTutiReparti(): Promise<string[]> {
    try {
      const response = await fetch(`${this.API_URL}/getAllReparti`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({})
      });

      const data = await response.json();
      console.log('Reparti:', data);
      if (data.status === 'success') {
        return data.data;
      }
    } catch (error) {
      console.error('Errore getTutiReparti:', error);
    }
    return [];
  }

  async getSlotDisponibili(medicoId: number, data: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.API_URL}/getSlotDisponibili`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ medicoId, data })
      });

      const result = await response.json();
      console.log('Slot disponibili:', result);
      if (result.status === 'success') {
        return result.data;
      }
    } catch (error) {
      console.error('Errore getSlotDisponibili:', error);
    }
    return [];
  }
}
