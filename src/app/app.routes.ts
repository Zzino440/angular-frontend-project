import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./features/user/pages/user-list/user-list.component').then(c => c.UserListComponent)
  },
  {
    path: 'add-user',
    loadComponent: () => import('./features/user/pages/user-add/user-add.component').then(c => c.UserAddComponent)
  },
  {
    path: 'user-detail/:id',
    loadComponent: () => import('./features/user/pages/user-detail/user-detail.component').then(c => c.UserDetailComponent)
  },
  {
    path: 'user-edit/:id',
    loadComponent: () => import('./features/user/pages/user-add/user-add.component').then(c => c.UserAddComponent)
  },
  {
    path: '', redirectTo: 'users', pathMatch: 'full'
  },
  {path: '**', redirectTo: 'users'}
];
