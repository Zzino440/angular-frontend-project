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

@Component({
    selector: 'app-user-list',
    imports: [
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        RouterLink,
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

  //variable to use it in the html
  protected readonly Permission = Permission;

  //direct injection cause i need to use it in html
  authenticationService = inject(AuthenticationService);
  snackBarNotificationService = inject(SnackBarNotificationService);
  userSignalsService = inject(UserSignalsService);

  //comp variables
  protected datasource = computed(() => new MatTableDataSource(this.userSignalsService.users()));

  //filters variables
  private filterEmail = signal('');

  //utils variables
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'actions'];

  //pagination variables
  protected pageEvent = computed(() => ({
    length: this.userSignalsService.pagination().totalElements,
    pageSize: this.userSignalsService.pagination().pageSize,
    pageIndex: this.userSignalsService.pagination().pageNumber,
  }));
  pageSizeOptions: number[] = [5, 10, 25, 100];

  //subject for component destruction
  private destroy$ = new Subject<boolean>();

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getUsersExceptCurrent(this.pageEvent().pageIndex, this.pageEvent().pageSize);
  }

  getUsersExceptCurrent(page: number, size: number) {
    const currentUserId = this.authenticationService.currentUserSignal()?.id;
    this.userSignalsService.loadUsersExceptCurrent(
      currentUserId,
      this.filterEmail(),
      page,
      size,
      this.destroy$
    );

    // Configurazione del sort dopo il caricamento dei dati
    this.datasource().sort = this.sort;
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
