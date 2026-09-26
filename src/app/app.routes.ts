import {Routes} from '@angular/router';
import {authGuard} from "./security/services/guards/auth.guard";

export const routes: Routes = [

  {
    path: 'signals',
    loadChildren: () => import('./features/training/routes').then(feature => feature.routes),
    canActivate: [authGuard],
  },

  {
    path: 'settings',
    // do not use loadComponent here as you do not want to leak the internals of your feature into your app
    loadChildren: () => import('./features/settings/routes').then(feature => feature.routes),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./security/pages/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'registration',
    loadComponent: () => import('./security/pages/registration/registration.component').then(c => c.RegistrationComponent)
  },
  {
    path: '', redirectTo: 'users', pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./features/user/routes').then(feature => feature.routes),
    canActivate: [authGuard],
  },
  {path: '**', redirectTo: 'users'}
];
