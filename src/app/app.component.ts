import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {UserListComponent} from "./features/user/pages/user-list/user-list.component";
import {ToolbarComponent} from "./navigation/components/toolbar/toolbar.component";
import {AuthenticationService} from "./security/services/authentication.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, UserListComponent, ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'angular-frontend-project';

  hideApp!: boolean;

  constructor(private authenticationService: AuthenticationService, private router: Router) {

  }

  ngOnInit(): void {
    /*    this.hideAppMethod()*/

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
