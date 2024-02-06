import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideAnimations} from '@angular/platform-browser/animations';
import {httpSecurityInterceptor} from "./security/services/http-security.interceptor";
import { provideStore } from '@ngrx/store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpSecurityInterceptor])),
    provideAnimations(),
    provideStore()
]
};
