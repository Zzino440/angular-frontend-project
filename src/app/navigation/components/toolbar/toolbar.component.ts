import {Component, inject, OnInit} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {ToolbarItemsConfig} from "../../config/toolbarItemsConfig";
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {AuthenticationService} from "../../../security/services/authentication.service";
import {UserService} from "../../../features/user/services/user.service";

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
  authenticationService = inject(AuthenticationService);
  toolbarItems = ToolbarItemsConfig;

  loggedUserId!: number;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.loggedUserId = Number(localStorage.getItem('userId'));
    this.userService.getUserById(this.loggedUserId)
      .subscribe({
        next: (res) => {
          this.authenticationService.currentUserSignal.set(res);
        },
        error: () => {
          this.authenticationService.logout();
          localStorage.clear();
        },
        complete: () => {
        }
      })
  }

  shouldShowItem(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  logout() {
    localStorage.clear();
    this.authenticationService.logout();
  }
}
