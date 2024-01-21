import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DeleteUserDialogComponent} from "../../components/delete-user-dialog/delete-user-dialog.component";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {DatasourcePipe} from "../../../../shared/pipes/datasource.pipe";
import {CamelCasePipe} from "../../../../shared/pipes/camel-case.pipe";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    AsyncPipe,
    DatasourcePipe,
    CamelCasePipe
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy {

  userList$!: Observable<User[]>;

  //utils variables
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'actions']

  constructor(private userService: UserService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userList$ = this.userService.getUserList();
  }

  openDeleteUserDialog(userId: number) {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      data: {userId: userId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.status === 'success') {
        this.getUsers();
      } else if (result?.status === 'cancelled') {
      }
    })
  }

  ngOnDestroy(): void {
  }
}
