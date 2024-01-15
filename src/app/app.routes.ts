import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'employees',
    loadComponent: () => import('./features/employee/pages/employee-list/employee-list.component').then(c => c.EmployeeListComponent)
  },
  {
    path: 'add-employee',
    loadComponent: () => import('./features/employee/pages/employee-add/employee-add.component').then(c => c.EmployeeAddComponent)
  },
  {
    path: 'employee-detail/:id',
    loadComponent: () => import('./features/employee/pages/employee-detail/employee-detail.component').then(c => c.EmployeeDetailComponent)
  },
  {
    path: 'employee-edit/:id',
    loadComponent: () => import('./features/employee/pages/employee-add/employee-add.component').then(c => c.EmployeeAddComponent)
  },
  {
    path: '', redirectTo: 'employees', pathMatch: 'full'
  },
  {path: '**', redirectTo: 'employees'}
];
