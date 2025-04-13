import {Component, inject, Input, OnInit} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {ToolbarItemsConfig} from "../../config/toolbarItemsConfig";
import {RouterLink} from "@angular/router";
import {TitleCasePipe} from "@angular/common";
import {AuthenticationService} from "../../../security/services/authentication.service";
import {MatSidenav} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDivider} from "@angular/material/divider";
import {SnackBarNotificationService} from "../../../shared/services/snack-bar-notification.service";
import {NotificationTypeEnum} from "../../../shared/enums/notification-type.enum";

@Component({
    selector: 'app-toolbar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    TitleCasePipe,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatDivider
  ],
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {

  @Input() drawer!: MatSidenav;

  authenticationService = inject(AuthenticationService);
  snackBarNotificationService = inject(SnackBarNotificationService);
  toolbarItems = ToolbarItemsConfig;

  constructor() {
  }

  ngOnInit(): void {
  }

  shouldShowItem(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  logout(){
    this.authenticationService.logout();
    this.snackBarNotificationService.notify('Logout effettuato con successo', 'OK', NotificationTypeEnum.INFO);
  }
}
