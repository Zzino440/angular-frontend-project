import {Component, computed, inject, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DeleteUserDialogComponent} from "../../components/delete-user-dialog/delete-user-dialog.component";
import {CamelCasePipe} from "../../../../shared/pipes/camel-case.pipe";
import {AuthenticationService} from "../../../../security/services/authentication.service";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {Subject} from "rxjs";
import {Permission} from "../../models/permission";
import {SnackBarNotificationService} from "../../../../shared/services/snack-bar-notification.service";
import {NotificationTypeEnum} from "../../../../shared/enums/notification-type.enum";
import {UserSignalsService} from "../../services/user-signals.service";
import {Store} from "@ngrx/store";
import {userFeature} from "../../store/user.reducer";
import {UserActions} from "../../store/user.actions";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
    selector: 'app-user-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    CamelCasePipe,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBar
  ],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  //variable to use it in the html
  protected readonly Permission = Permission;

  //direct injection cause i need to use it in html
  authenticationService = inject(AuthenticationService);
  snackBarNotificationService = inject(SnackBarNotificationService);
  userSignalsService = inject(UserSignalsService);

  private store = inject(Store);
  private users = this.store.selectSignal(userFeature.selectUsers);
  private pagination = this.store.selectSignal(userFeature.selectPagination);
  protected loading = this.store.selectSignal(userFeature.selectLoading);

  //comp variables
  protected datasource = computed(() => {
    const ds = new MatTableDataSource(this.users());
    ds.sort = this.sort;
    return ds;
  });

  protected pageEvent = computed( () => ({
    length: this.pagination().totalElements,
    pageSize: this.pagination().pageSize,
    pageIndex: this.pagination().pageNumber,
  }) )

  //filters variables
  private filterEmail = signal('');

  //utils variables
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'actions'];
  pageSizeOptions: number[] = [5, 10, 25, 100];

  //subject for component destruction
  private destroy$ = new Subject<boolean>();

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getUsersExceptCurrent(this.pageEvent().pageIndex, this.pageEvent().pageSize);


  }



  getUsersExceptCurrent(page: number, size: number) {
    const currentUserId = this.authenticationService.currentUserSignal()?.id;
    this.store.dispatch(UserActions.loadUsers ({
      currentUserId,
      email: this.filterEmail(),
      page,
      size,
    }))
    console.log(this.loading())
  }

  handleSelectedEmail(email: string) {
    this.filterEmail.update(() => email);
    this.getUsersExceptCurrent(this.pageEvent().pageIndex, this.pageEvent().pageSize);
    //resetto il pageIndex quando applico il filtro
    this.paginator.pageIndex = 0;
  }

  onChangePage(pe: PageEvent) {
    this.getUsersExceptCurrent(pe.pageIndex, pe.pageSize);
  }

  openDeleteUserDialog(userId: number) {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      data: {userId: userId}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.status === 'success') {
        this.userSignalsService.deleteUser(userId, this.destroy$);
        this.paginator.pageIndex = 0;
        this.snackBarNotificationService.notify('User deleted', 'OK', NotificationTypeEnum.INFO);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
