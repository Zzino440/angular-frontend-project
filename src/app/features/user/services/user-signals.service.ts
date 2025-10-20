import {computed, inject, Injectable, signal} from '@angular/core';
import {User} from '../models/user';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {SnackBarNotificationService} from '../../../shared/services/snack-bar-notification.service';
import {NotificationTypeEnum} from '../../../shared/enums/notification-type.enum';
import {takeUntil} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {PagedResponse} from '../../../shared/models/paged-response';

@Injectable({
    providedIn: 'root'
})
export class UserSignalsService {
    private httpClient = inject(HttpClient);
    private snackBarNotificationService = inject(SnackBarNotificationService);

    private readonly environment = environment.endpointUri;
    private readonly usersUri = 'users/';

    // Signals privati
    private readonly _usersSignal = signal<User[]>([]);
    private readonly _isLoadingSignal = signal<boolean>(false);
    private readonly _paginationSignal = signal<{totalElements: number; totalPages: number; pageSize: number; pageNumber: number}>({
        totalElements: 0,
        totalPages: 0,
        pageSize: 10,
        pageNumber: 0
    });

    // Signals pubblici (computed)
    public users = computed(() => this._usersSignal());
    public isLoading = computed(() => this._isLoadingSignal());
    public hasUsers = computed(() => this._usersSignal().length > 0);
    public pagination = computed(() => this._paginationSignal());

    /**
     * Carica la lista degli utenti
     */
    public loadUsers(destroy$: Observable<boolean>) {
        this.setLoading(true);

        this.httpClient.get<User[]>(`${this.environment}${this.usersUri}`).pipe(
            takeUntil(destroy$)
        ).subscribe({
            next: (users) => {
                this.setUsers(users);
                this.setLoading(false);
            },
            error: (error: HttpErrorResponse) => {
                console.error('errore segnalato da userService:', error.error);
                this.snackBarNotificationService.notify(error.error, 'OK', NotificationTypeEnum.ERROR);
                this.setLoading(false);
                throwError(() => error);
            }
        });
    }

    /**
     * Carica la lista degli utenti escludendo l'utente corrente
     */
    public loadUsersExceptCurrent(id: number | undefined, email: string, page: number, size: number, destroy$: Observable<boolean>) {
        this.setLoading(true);

        const params = new HttpParams()
            .set('currentUserId', id || '')
            .set('userEmail', email || '')
            .set('page', page)
            .set('size', size);

        this.httpClient.get<PagedResponse<User>>(`${this.environment}${this.usersUri}not-current`, { params }).pipe(
            takeUntil(destroy$)
        ).subscribe({
            next: (response) => {
                this.setUsers(response.content);
                this.setPagination({
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    pageSize: response.size,
                    pageNumber: response.number
                });
                this.setLoading(false);
            },
            error: (error: HttpErrorResponse) => {
                console.error('errore segnalato da userService:', error.error);
                this.snackBarNotificationService.notify(error.error, 'OK', NotificationTypeEnum.ERROR);
                this.setLoading(false);
                this.clearUsers();
                throwError(() => error);
            }
        });
    }

    /**
     * Aggiunge un nuovo utente
     */
    public addUser(user: Partial<User>, destroy$: Observable<boolean>) {
        this.setLoading(true);

        this.httpClient.post<User>(`${this.environment}${this.usersUri}`, user).pipe(
            takeUntil(destroy$)
        ).subscribe({
            next: (newUser) => {
                this._usersSignal.update(users => [...users, newUser]);
                this.setLoading(false);
            },
            error: (error: HttpErrorResponse) => {
                console.error('errore segnalato da userService:', error.error);
                this.snackBarNotificationService.notify(error.error, 'OK', NotificationTypeEnum.ERROR);
                this.setLoading(false);
                throwError(() => error);
            }
        });
    }

    /**
     * Aggiorna un utente esistente
     */
    public updateUser(id: number, user: Partial<User>, destroy$: Observable<boolean>) {
        this.setLoading(true);

        this.httpClient.put<User>(`${this.environment}${this.usersUri}${id}`, user).pipe(
            takeUntil(destroy$)
        ).subscribe({
            next: (updatedUser) => {
                this._usersSignal.update(users =>
                    users.map(u => u.id === id ? updatedUser : u)
                );
                this.setLoading(false);
            },
            error: (error: HttpErrorResponse) => {
                console.error('errore segnalato da userService:', error.error);
                this.snackBarNotificationService.notify(error.error, 'OK', NotificationTypeEnum.ERROR);
                this.setLoading(false);
                throwError(() => error);
            }
        });
    }

    /**
     * Elimina un utente
     */
    public deleteUser(id: number, destroy$: Observable<boolean>) {
        this.setLoading(true);

        this.httpClient.delete<void>(`${this.environment}${this.usersUri}${id}`).pipe(
            takeUntil(destroy$)
        ).subscribe({
            next: () => {
                this._usersSignal.update(users => users.filter(u => u.id !== id));
                this.setLoading(false);
            },
            error: (error: HttpErrorResponse) => {
                console.error('errore segnalato da userService:', error.error);
                this.snackBarNotificationService.notify(error.error, 'OK', NotificationTypeEnum.ERROR);
                this.setLoading(false);
                throwError(() => error);
            }
        });
    }

    /**
     * Imposta la lista degli utenti
     */
    private setUsers(users: User[]): void {
        this._usersSignal.set(users);
    }

    /**
     * Imposta i dati di paginazione
     */
    private setPagination(pagination: {totalElements: number; totalPages: number; pageSize: number; pageNumber: number}): void {
        this._paginationSignal.set(pagination);
    }

    /**
     * Imposta lo stato di caricamento
     */
    private setLoading(isLoading: boolean): void {
        this._isLoadingSignal.set(isLoading);
    }

    /**
     * Pulisce i dati degli utenti
     */
    public clearUsers(): void {
        this._usersSignal.set([]);
    }
}
