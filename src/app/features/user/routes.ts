import {Routes} from "@angular/router";
import {provideState} from "@ngrx/store";
import {userFeature} from "./store/user.reducer";
import {provideEffects} from "@ngrx/effects";
import * as userEffects from "./store/user.effects";


export const routes: Routes = [
  {
    path: '',
    providers:[
      provideState(userFeature),
      provideEffects(userEffects)
    ],
    children: [
      {
        path: 'users',
        loadComponent: () => import('./pages/user-list/user-list.component').then(c => c.UserListComponent),
      },
      {
        path: 'add-user',
        loadComponent: () => import('./pages/new-user-add/new-user-add.component').then(c => c.NewUserAddComponent),
      },
      {
        path: 'user-detail/:id',
        loadComponent: () => import('./pages/user-detail/user-detail.component').then(c => c.UserDetailComponent),
      },
      {
        path: 'user-edit/:id',
        loadComponent: () => import('./pages/new-user-add/new-user-add.component').then(c => c.NewUserAddComponent),
      },
    ]
  },
];
