import { Component, signal, computed, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Visita, VisiteService } from '../services/visite.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-calendario',
  imports: [CommonModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
})
export class Calendario implements OnInit {
  @Input() visite: Visita[] = [];
  @Output() visitaClicked = new EventEmitter<Visita>();

  currentDate = signal(new Date());
  weekStart = computed(() => {
    const date = new Date(this.currentDate());
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  });

  days = computed(() => {
    const start = this.weekStart();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      return date;
    });
  });

  hours = [9, 10, 11, 12, 13, 14, 15, 16, 17]; // Orari 9:00-17:00

  constructor(private visiteService: VisiteService, private authService: AuthService) {}

  ngOnInit() {
    // Inizializza le visite basate sul ruolo dell'utente
    const user = this.authService.getCurrentUser();
    if (user?.role === 'paziente') {
      this.visite = this.visiteService.getVisiteByPaziente(user.id);
    } else if (user?.role === 'medico') {
      this.visite = this.visiteService.getVisiteByMedico(user.id);
    }
  }

  previousWeek() {
    const newDate = new Date(this.currentDate());
    newDate.setDate(newDate.getDate() - 7);
    this.currentDate.set(newDate);
  }

  nextWeek() {
    const newDate = new Date(this.currentDate());
    newDate.setDate(newDate.getDate() + 7);
    this.currentDate.set(newDate);
  }

  getVisitaSlot(day: Date, hour: number): Visita | undefined {
    return this.visite.find(v => {
      const visitaDate = new Date(v.dataInizio);
      return (
        visitaDate.getDate() === day.getDate() &&
        visitaDate.getMonth() === day.getMonth() &&
        visitaDate.getFullYear() === day.getFullYear() &&
        visitaDate.getHours() === hour
      );
    });
  }

  onVisitaClick(visita: Visita) {
    this.visitaClicked.emit(visita);
  }

  getDayName(date: Date): string {
    const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    return days[date.getDay()];
  }

  formatDate(date: Date): string {
    return date.getDate() + '/' + (date.getMonth() + 1);
  }
}
