import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'employees',
    loadComponent: () => import('./features/employee/components/employee-list/employee-list.component').then(c => c.EmployeeListComponent)
  },
  {
    path: 'add-employee',
    loadComponent: () => import('./features/employee/components/employee-add/employee-add.component').then(c => c.EmployeeAddComponent)
  },
  {
    path: 'employee-detail/:id',
    loadComponent: () => import('./features/employee/components/employee-detail/employee-detail.component').then(c => c.EmployeeDetailComponent)
  },
  {
    path: '', redirectTo: 'employees', pathMatch: 'full'
  },
  {path: '**', redirectTo: 'employees'}
];
