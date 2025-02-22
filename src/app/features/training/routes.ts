import {Routes} from "@angular/router";
import {SignalsTrainingComponent} from "./pages/signals-training/signals-training.component";


export const routes: Routes = [
  {
    path: '',
    children: [
      // {
      //   path: 'agency',
      //   component: SettingsComponent,
      // },
      {
        path: '',
        pathMatch: 'full',
        component: SignalsTrainingComponent
      }
    ]
  },
  {
    path: '', redirectTo: 'signals', pathMatch: 'full',
  },
];
