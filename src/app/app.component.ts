import {Component, OnInit} from '@angular/core';

import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {ToolbarComponent} from "./navigation/components/toolbar/toolbar.component";
import {AuthenticationService} from "./security/services/authentication.service";

@Component({
    selector: 'app-root',
  imports: [RouterOutlet, ToolbarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'angular-frontend-project';

  hideApp!: boolean;

  constructor(private authenticationService: AuthenticationService, private router: Router) {

  }

  ngOnInit(): void {
  }

  hideAppMethod() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log(this.router.url);
        console.log('this.hideApp: ', this.hideApp)
        console.log(this.authenticationService.currentUserSignal !== undefined)
        if (this.authenticationService.currentUserSignal === undefined && (this.router.url !== '/login'))
          console.log(this.router.url); // Stampa l'URL corrente
        this.hideApp = true;
      }
    });
  }
}
