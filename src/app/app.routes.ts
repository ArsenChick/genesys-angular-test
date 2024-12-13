import { Routes } from '@angular/router';
import { ROUTE_NAMES } from './constants';

export const routes: Routes = [
  {
    path: ROUTE_NAMES.home,
    loadComponent: () => import('./routes/main-page/main-page.component')
      .then(m => m.MainPageComponent),
    title: 'Main Page',
  },
  {
    path: `${ROUTE_NAMES.profile}/:id`,
    loadComponent: () => import('./routes/profile-page/profile-page.component')
      .then(m => m.ProfilePageComponent),
    title: 'Profile',
  },
  { path: '', redirectTo: ROUTE_NAMES.home, pathMatch: 'full' },
  { path: '**', redirectTo: ROUTE_NAMES.home },
];
