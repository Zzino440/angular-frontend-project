import {Component, OnInit} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {ToolbarItemsConfig} from "../config/toolbarItemsConfig";
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {AuthenticationService} from "../../security/services/authentication.service";
import {UserService} from "../../features/user/services/user.service";

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

  loggedUserId!: number;

  constructor(private authenticationService: AuthenticationService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.loggedUserId = Number(localStorage.getItem('userId'));
    console.log('this.loggedUserId: ',this.loggedUserId)
    if (this.loggedUserId != 0) {
      this.userService.getUserById(this.loggedUserId).subscribe(res => {
        console.log('res: ', res)
        this.authenticationService.currentUserSignal.set(res);
      })
    }
  }

  shouldShowItem(): boolean {
    return this.authenticationService.currentUserSignal() !== undefined;
  }
}
