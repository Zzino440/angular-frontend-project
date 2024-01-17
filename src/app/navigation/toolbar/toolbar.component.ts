import {Component, OnInit} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {ToolbarItemsConfig} from "../config/toolbarItemsConfig";
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {AuthenticationService} from "../../security/services/authentication.service";
import {ToolbarItem} from "../models/toolbarItem.model";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    NgForOf,
    NgIf
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {
  toolbarItems = ToolbarItemsConfig;

  constructor(protected authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
  }

  shouldShowItem(item: ToolbarItem): boolean {
    const isAuthenticated = this.authenticationService.currentUserSignal() !== undefined;
    return isAuthenticated || !item.requiresAuth;
  }
}
