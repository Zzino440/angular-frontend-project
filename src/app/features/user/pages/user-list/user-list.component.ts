import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DeleteUserDialogComponent} from "../../components/delete-user-dialog/delete-user-dialog.component";
import {AsyncPipe} from "@angular/common";
import {DatasourcePipe} from "../../../../shared/pipes/datasource.pipe";
import {CamelCasePipe} from "../../../../shared/pipes/camel-case.pipe";
import {AuthenticationService} from "../../../../security/services/authentication.service";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";

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
    CamelCasePipe,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageEvent: PageEvent = {
    length:0,
    pageSize:10,
    pageIndex:0,
    previousPageIndex:0
  };
  dataSource!: MatTableDataSource<User>;

  //utils variables
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'actions']

  constructor(private userService: UserService, public dialog: MatDialog, private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.getUserexceptCurrent(this.pageEvent.pageIndex, this.pageEvent.pageSize);
  }

  getUserexceptCurrent(page: number, size: number) {
    let currentUserId = this.authenticationService.currentUserSignal()?.id;
    this.userService.getUserListExceptCurrent(currentUserId, page, size)
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response.content);
        this.dataSource.sort = this.sort;
        this.pageEvent.length = response.totalElements
        this.pageEvent.pageSize = response.size
      });
  }

  onChangePage(pe: PageEvent) {
    this.getUserexceptCurrent(pe.pageIndex, pe.pageSize);
  }


  openDeleteUserDialog(userId: number) {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      data: {userId: userId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.status === 'success') {
        this.getUserexceptCurrent(this.pageEvent.pageIndex, this.pageEvent.pageSize);
      } else if (result?.status === 'cancelled') {
      }
    })
  }

  ngOnDestroy(): void {
  }
}
