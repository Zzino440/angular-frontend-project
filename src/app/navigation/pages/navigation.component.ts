import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {AsyncPipe, NgIf} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {RouterOutlet} from "@angular/router";
import {ToolbarComponent} from "../components/toolbar/toolbar.component";
import {AuthenticationService} from "../../security/services/authentication.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    ToolbarComponent,
  ]
})
export class NavigationComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;


  authenticationService = inject(AuthenticationService);
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor() {

  }

  ngOnInit() {

  }


  shouldShowItem(): boolean {
    return this.authenticationService.isLoggedIn();
  }
}
