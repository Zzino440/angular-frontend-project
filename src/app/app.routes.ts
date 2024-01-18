import {Routes} from '@angular/router';
import {authGuard} from "./security/services/guards/auth.guard";

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./security/pages/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'registration',
    loadComponent: () => import('./security/pages/registration/registration.component').then(c => c.RegistrationComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./features/user/pages/user-list/user-list.component').then(c => c.UserListComponent),
    canActivate:[authGuard],

  },
  {
    path: 'add-user',
    loadComponent: () => import('./features/user/pages/user-add/user-add.component').then(c => c.UserAddComponent),
    canActivate:[authGuard],
  },
  {
    path: 'user-detail/:id',
    loadComponent: () => import('./features/user/pages/user-detail/user-detail.component').then(c => c.UserDetailComponent),
    canActivate:[authGuard],
  },
  {
    path: 'user-edit/:id',
    loadComponent: () => import('./features/user/pages/user-add/user-add.component').then(c => c.UserAddComponent),
    canActivate:[authGuard],
  },
  {
    path: '', redirectTo: 'users', pathMatch: 'full',
  },
  {path: '**', redirectTo: 'users'}
];
