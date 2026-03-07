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

  // Restituisce tutte le visite di un paziente
  async getVisiteByPaziente(pazienteId: number): Promise<Visita[]> {
    try {
      const response = await fetch(`${this.API_URL}/getVisiteByPaziente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pazienteId })
      });

      const data = await response.json();
      if (data.status === 'success') {
        return data.data;
      }
    } catch (error) {
      console.error('Errore getVisiteByPaziente:', error);
    }
    return [];
  }

  // Restituisce tutte le visite di un medico
  async getVisiteByMedico(medicoId: number): Promise<Visita[]> {
    try {
      const response = await fetch(`${this.API_URL}/getVisiteByMedico`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ medicoId })
      });

      const data = await response.json();
      if (data.status === 'success') {
        return data.data;
      }
    } catch (error) {
      console.error('Errore getVisiteByMedico:', error);
    }
    return [];
  }

  // Restituisce le visite filtrate per reparto
  async getVisiteByReparto(reparto: string): Promise<Visita[]> {
    try {
      const response = await fetch(`${this.API_URL}/getVisiteByReparto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reparto })
      });

      const data = await response.json();
      if (data.status === 'success') {
        return data.data;
      }
    } catch (error) {
      console.error('Errore getVisiteByReparto:', error);
    }
    return [];
  }

  // Restituisce le visite non pagate di un paziente
  async getVisitaNonPagate(pazienteId: number): Promise<Visita[]> {
    try {
      const response = await fetch(`${this.API_URL}/getVisiteByPazienteNP`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pazienteId })
      });

      const data = await response.json();
      if (data.status === 'success') {
        return data.data;
      }
    } catch (error) {
      console.error('Errore getVisitaNonPagate:', error);
    }
    return [];
  }

  // Crea una nuova visita
  async createVisita(visita: Omit<Visita, 'idVis'>): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/createVisita`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(visita)
      });

      const data = await response.json();
      if (data.status === 'success') {
        return true;
      }
    } catch (error) {
      console.error('Errore createVisita:', error);
    }
    return false;
  }

  // Aggiorna una visita esistente
  async updateVisita(id: number, updates: Partial<Visita>): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/updateVisita`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, ...updates })
      });

      const data = await response.json();
      if (data.status === 'success') {
        return true;
      }
    } catch (error) {
      console.error('Errore updateVisita:', error);
    }
    return false;
  }

  // Elimina (logicamente) una visita
  async deleteVisita(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/deleteVisita`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      if (data.status === 'success') {
        return true;
      }
    } catch (error) {
      console.error('Errore deleteVisita:', error);
    }
    return false;
  }

  // Segna una visita come pagata
  async pagaVisita(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/pagaVisita`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      if (data.status === 'success') {
        return true;
      }
    } catch (error) {
      console.error('Errore pagaVisita:', error);
    }
    return false;
  }

  // Restituisce i medici di un reparto
  async getMediciByReparto(reparto: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_URL}/getMediciByReparto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reparto })
      });

      const data = await response.json();
      if (data.status === 'success') {
        return data.data;
      }
    } catch (error) {
      console.error('Errore getMediciByReparto:', error);
    }
    return [];
  }

  // Restituisce l'elenco dei reparti
  async getTutiReparti(): Promise<string[]> {
    try {
      const response = await fetch(`${this.API_URL}/getAllReparti`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({})
      });

      const data = await response.json();
      if (data.status === 'success') {
        return data.data;
      }
    } catch (error) {
      console.error('Errore getTutiReparti:', error);
    }
    return [];
  }

  // Restituisce gli slot orari liberi per un medico in una data
  async getSlotDisponibili(medicoId: number, data: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.API_URL}/getSlotDisponibili`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ medicoId, data })
      });

      const result = await response.json();
      if (result.status === 'success') {
        return result.data;
      }
    } catch (error) {
      console.error('Errore getSlotDisponibili:', error);
    }
    return [];
  }
}
