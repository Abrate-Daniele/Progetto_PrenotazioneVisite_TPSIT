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

  user: any = null;
  currentDate = signal(new Date());
  weekStart = computed(() => {
    const date = new Date(this.currentDate());
    const day = (date.getDay() || 7) - 1; // 0 = lunedì, 6 = domenica
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

  hours = [9, 10, 11, 12, 13, 14, 15, 16]; // Orari 9:00-17:00 (8 slot da 1 ora)

  constructor(private visiteService: VisiteService, private authService: AuthService) {}

  async ngOnInit() {
    // Inizializza le visite basate sul ruolo dell'utente
    const user = this.authService.getCurrentUser();
    this.user = user;
    if (user?.role === 'paziente') {
      this.visite = await this.visiteService.getVisiteByPaziente(user.id);
    } else if (user?.role === 'medico') {
      console.log(user)
      this.visite = await this.visiteService.getVisiteByMedico(user.id);
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
    hour -= 9
    return this.visite.find(v => {
      const visitaDate = new Date(v.data);
      return (
        visitaDate.getDate() === day.getDate() &&
        visitaDate.getMonth() === day.getMonth() &&
        visitaDate.getFullYear() === day.getFullYear() &&

        v.ora === hour
      );
    });
  }

  onVisitaClick(visita: Visita) {
    console.log(visita)
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
