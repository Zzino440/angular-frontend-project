import {Routes} from "@angular/router";
import {SettingsComponent} from "./pages/settings/settings.component";


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
            component: SettingsComponent
          }
        ]
  },
  {
    path: '', redirectTo: 'settings', pathMatch: 'full',
  },
];
