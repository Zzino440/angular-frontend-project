import {Component, inject, OnInit} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {ToolbarItemsConfig} from "../../config/toolbarItemsConfig";
import {RouterLink} from "@angular/router";
import {JsonPipe, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {AuthenticationService} from "../../../security/services/authentication.service";

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
    JsonPipe
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {
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
