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

  async getVisitaNonPagate(pazienteId: number): Promise<Visita[]> {
    const response = await fetch(`http://localhost:8081/getVisiteByPazienteNP`, {
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

  async createVisita(visita: Omit<Visita, 'id'>): Promise<void> {
    const response = await fetch(`http://localhost:8081/createVisita`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(visita)
    });

    const data = await response.json();
    console.log(data)
    if (data.status === 'success') {
      // Ricarica le visite del paziente per aggiornare il signal
      const visite = await this.getVisiteByPaziente(visita.pazienteId);
      this.visite.set(visite);
    }
  }

  async updateVisita(id: number, updates: Partial<Visita>): Promise<void> {
    const response = await fetch(`http://localhost:8081/updateVisita`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id, ...updates })
    });

    const data = await response.json();
    console.log(data)
    if (data.status === 'success') {
      // Aggiorna il signal locale
      this.visite.update(visite =>
        visite.map(v => v.id === id ? { ...v, ...updates } : v)
      );
    }
  }

  async deleteVisita(id: number): Promise<void> {
    const response = await fetch(`http://localhost:8081/deleteVisita`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id })
    });

    const data = await response.json();
    console.log(data)
    if (data.status === 'success') {
      this.updateVisita(id, { stato: 'cancellata' });
    }
  }

  async pagaVisita(id: number): Promise<void> {
    const response = await fetch(`http://localhost:8081/pagaVisita`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id })
    });

    const data = await response.json();
    console.log(data)
    if (data.status === 'success') {
      this.updateVisita(id, { pagata: true });
    }
  }

  async getMediciByReparto(reparto: string): Promise<any[]> {
    const response = await fetch(`http://localhost:8081/getMediciByReparto`, {
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

  async getTutiReparti(): Promise<string[]> {
    const response = await fetch(`http://localhost:8081/getAllReparti`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({})
    });

    const data = await response.json();
    console.log(data)
    if (data.status === 'success') {
      return data.data;
    }
    return [];
  }
}
