import {Component, DestroyRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {Subject, takeUntil} from "rxjs";
import {UserFiltersComponent} from "../../components/user-filters/user-filters.component";
import {Permission} from "../../models/permission";

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
    MatSortModule,
    UserFiltersComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy {

  //direct injection cause i need to use it in html
  authenticationService = inject(AuthenticationService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageEvent: PageEvent = {
    length: 0,
    pageSize: 10,
    pageIndex: 0,
  };
  pageSizeOptions: number[] = [5, 10, 25, 100];

  dataSource!: MatTableDataSource<User>;

  //filters variables
  filterEmail: string = '';

  //utils variables
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'actions'];

  //subject that controls if the component is destroyed or another request has been submitted
  //controls the subscription to getUser
  private getUsersRequestManager = new Subject<void>();

  constructor(private userService: UserService, public dialog: MatDialog, private destroyRef: DestroyRef) {
  }

  ngOnInit(): void {
    this.getUserexceptCurrent(this.pageEvent.pageIndex, this.pageEvent.pageSize);
  }

  getUserexceptCurrent(page: number, size: number) {
    const currentUserId = this.authenticationService.currentUserSignal()?.id;
    this.getUsersRequestManager.next();
    this.userService.getUserListExceptCurrent(currentUserId, this.filterEmail, page, size).pipe(
      takeUntil(this.getUsersRequestManager),
    ).subscribe(usersResponse => {
      // Utilizziamo 'tap' per effetti collaterali, come l'aggiornamento della dataSource
      this.dataSource = new MatTableDataSource(usersResponse.content);
      this.dataSource.sort = this.sort;
      this.pageEvent.length = usersResponse.totalElements;
      this.pageEvent.pageSize = usersResponse.size;
    });
  }

  getUserExceptCurrent() {

  }


  handleSelectedEmail(email: string) {
    this.filterEmail = email;
    this.getUserexceptCurrent(this.pageEvent.pageIndex, this.pageEvent.pageSize);
    //resetto il pageIndex quando applico il filtro
    //in questo modo quando filtro che sono su una pagina differente dalla prima, mi torna sulla prima pagina
    this.paginator.pageIndex = 0;
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
        this.paginator.pageIndex = 0;
      } else if (result?.status === 'cancelled') {
      }
    })
  }

  ngOnDestroy() {
    this.getUsersRequestManager.next();
    this.getUsersRequestManager.complete();
  }

  protected readonly Permission = Permission;
}
