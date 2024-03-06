import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {RegisterRequest} from "../models/register-request";
import {lastValueFrom, Observable} from "rxjs";
import {LoginRequest} from "../models/login-request";
import {User} from "../../features/user/models/user";
import {Permission} from "../../features/user/models/permission";
import {Role} from "../../features/user/models/role.enum";
import {UserService} from "../../features/user/services/user.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userService = inject(UserService);
  router = inject(Router);

  currentUserSignal = signal<User | undefined | null>(undefined);

  private environment = environment.endpointUri;
  private authUri = "auth/"

  constructor(private httpClient: HttpClient) {
  }

  registration(registerRequest: RegisterRequest): Observable<User> {
    return this.httpClient.post<User>(`${this.environment}${this.authUri}register`, registerRequest)
  }

  authenticate(loginRequqest: LoginRequest): Observable<User> {
    return this.httpClient.post<User>(`${this.environment}${this.authUri}authenticate`, loginRequqest)
  }

  isLoggedIn() {
    return this.currentUserSignal() !== undefined;
  }

  logout() {
    return this.currentUserSignal.set(undefined);
  }

  /**
   * Verifica se l'utente corrente è autenticato.
   * Effettua una richiesta al backend utilizzando l'ID dell'utente corrente per recuperare i dettagli dell'utente.
   * Se i dettagli dell'utente vengono recuperati con successo, l'utente è considerato autenticato,
   * e il metodo restituisce `true`. In caso di errore nel recupero dei dettagli dell'utente (es.,
   * l'utente non esiste o si verifica un problema di connessione), viene eseguito il logout,
   * pulito il localStorage, e l'utente viene reindirizzato alla pagina di login.
   *
   * @returns {Promise<boolean>} Una promessa che si risolve con `true` se l'utente è autenticato,
   *                             altrimenti reindirizza alla pagina di login e risolve con `false`.
   */
  async isAuthenticated(): Promise<boolean> {
    const loggedUserId = this.currentUserId;
    try {
      const user: User = await lastValueFrom(this.userService.getUserById(loggedUserId));
      // Imposta l'utente corrente nel segnale utente corrente.
      this.currentUserSignal.set(user);
    } catch (error) {
      // In caso di errore nel recupero dei dettagli utente, esegue il logout e pulisce il localStorage.
      this.logout();
      localStorage.clear();
      console.log('Error fetching user:', error);
    }

    const isAuthenticated = this.isLoggedIn();
    // Verifica se l'utente è considerato loggato.
    if (isAuthenticated) {
      return true;
    } else {
      // Se non autenticato, reindirizza all'URL di login.
      await this.router.navigate(['/login']);
      return false;
    }
  }


  userHasAllAuthorities(permissions: Permission[]) {
    return permissions.every(permission => this.currentUserSignal()?.authorities.includes(permission));
  }

  userHasOneOfTheAuthorities(permissions: Permission[]) {
    return permissions.some(permission => this.currentUserSignal()?.authorities.includes(permission));
  }

  userHasOneOfTheRoles(roles: Role[]) {
    return roles.some(role => this.currentUserSignal()?.role?.includes(role))
  }

  checkEmail(email: string): Observable<string> {
    const params = new HttpParams().set('email', email);
    return this.httpClient.get<string>(`${this.environment}${this.authUri}check-email`, {params});
  }

  //getters
  get currentUserId(): number {
    return Number(localStorage.getItem('userId'));
  }

}
