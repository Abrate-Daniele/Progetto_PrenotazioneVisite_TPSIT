import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Homepage } from './homepage/homepage';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'homepage', component: Homepage },
  { path: '**', redirectTo: '/login' },
];
