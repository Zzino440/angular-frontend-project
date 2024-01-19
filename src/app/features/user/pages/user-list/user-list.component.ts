import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DeleteUserDialogComponent} from "../../components/delete-user-dialog/delete-user-dialog.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy {

  //utils variables
  private subscription: Subscription = new Subscription();

  userList!: User[];

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'actions']

  datasource: MatTableDataSource<User> = new MatTableDataSource<User>();

  constructor(private userService: UserService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers() {
    this.subscription.add(
      this.userService.getUserList().subscribe(res => {
        this.userList = res;
        this.datasource.data = res;
      })
    )
  }

  openDeleteUserDialog(userId: number) {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      data: {userId: userId}
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result?.status === 'success') {
          this.getUsers();
        } else if (result?.status === 'cancelled') {
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
