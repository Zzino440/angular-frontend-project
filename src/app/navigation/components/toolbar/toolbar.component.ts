import {Component, inject, Input, OnInit} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {ToolbarItemsConfig} from "../../config/toolbarItemsConfig";
import {RouterLink} from "@angular/router";
import {JsonPipe, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {AuthenticationService} from "../../../security/services/authentication.service";
import {MatSidenav} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    NgForOf,
    NgIf,
    TitleCasePipe,
    JsonPipe,
    MatIcon
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {

  @Input() drawer!: MatSidenav;
  authenticationService = inject(AuthenticationService);
  toolbarItems = ToolbarItemsConfig;

  constructor() {
  }

  ngOnInit(): void {
  }

  shouldShowItem(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  logout() {
    localStorage.clear();
    this.authenticationService.logout();
  }
}
