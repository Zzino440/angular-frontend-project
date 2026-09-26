# Corso pratico: integrare NgRx nel progetto Angular 20

> Guida da eseguire **a mano**, modulo per modulo. Ogni modulo ha: teoria (perché), pratica (cosa scrivere), verifica (come sapere che funziona) e un mini-quiz.
> Ambito di questo corso: **integrazione generica** (store, slice, effects, devtools, test). Il collegamento ai componenti/pagine è lo **step successivo** e qui è solo anticipato.

---

## Indice

0. [Pro e contro di NgRx per *questo* progetto](#0-pro-e-contro)
1. [Cos'è NgRx e come ragiona (teoria)](#1-teoria)
2. [Dove siamo partiti: mappa del codice attuale](#2-mappa)
3. [Modulo A – Installazione](#modulo-a)
4. [Modulo B – Bootstrap dello store + DevTools](#modulo-b)
5. [Modulo C – La prima slice: `user` (actions, reducer, selectors)](#modulo-c)
6. [Modulo D – Effects: gli effetti collaterali (HTTP)](#modulo-d)
7. [Modulo E – Registrare la slice (lazy) e verificare con DevTools](#modulo-e)
8. [Modulo F – Test di reducer, selectors, effects](#modulo-f)
9. [Modulo G – Slice `auth` a livello root + meta-reducer di logout (esercizio guidato, **rimandato**)](#modulo-g)
10. [Modulo H – Entity adapter (opzionale)](#modulo-h)
11. [Trappole comuni](#trappole)
12. [Cheat sheet e glossario](#cheat)

**Parte 2 – Integrazione nei componenti**

13. [Revisione della tua implementazione A–F (da sistemare prima di partire)](#revisione)
14. [Modulo I – Come un componente parla con lo store (teoria)](#modulo-i)
15. [Modulo J – Estendere lo store per i componenti (`selectedUser` + effect di UI)](#modulo-j)
16. [Modulo K – `user-list`: lettura e paginazione](#modulo-k)
17. [Modulo L – `user-list`: eliminazione](#modulo-l)
18. [Modulo M – `user-detail`](#modulo-m)
19. [Modulo N – `new-user-add`: form di creazione/modifica](#modulo-n)
20. [Modulo O – Pulizia](#modulo-o)
21. [Modulo P – Test di componente con `provideMockStore`](#modulo-p)
22. [Criteri di successo della Parte 2 e prossimi passi](#fine)

---

<a id="0-pro-e-contro"></a>
## 0. Pro e contro di NgRx per questo progetto

### Pro
- **Unico flusso di dati, prevedibile**: ogni modifica passa da un'azione → un reducer. Se lo stato è sbagliato, c'è un solo posto dove cercare.
- **Tracciabilità/debug**: Redux DevTools mostra ogni azione, lo stato prima/dopo, e permette il *time travel*. Con i `subscribe` sparsi è impossibile.
- **Stato condiviso senza prop-drilling né servizi "dio"**: utenti, sessione, categorie sono letti da più pagine.
- **Separazione netta**: componenti = UI; reducer = logica di stato pura; effects = I/O. Il codice diventa molto testabile (reducer e selectors sono funzioni pure).
- **Selectors memoizzati**: i valori derivati si ricalcolano solo se cambiano gli input.
- **Convenzioni condivise**: chi conosce NgRx si orienta subito in qualunque progetto; utile in team.
- **Scalabilità**: se l'app cresce (molti domini, cache, ottimistic update, undo) hai già l'infrastruttura.

### Contro
- **Boilerplate**: per una semplice `GET /users` servono action (×3), reducer, effect, selector. È il costo principale.
- **Curva di apprendimento**: 4-5 concetti nuovi (action, reducer, selector, effect, store) + RxJS operators (`switchMap`, `exhaustMap`, `catchError`).
- **Indirezione**: leggere "cosa succede quando clicco" richiede di saltare tra 4 file.
- **Overkill per app piccole**: questo progetto ha 3 domini (`settings`, `training`, `user`) e CRUD semplice. **Oggi già usi i Signals** (`UserSignalsService`, `currentUserSignal`) che risolvono lo stesso problema con molto meno codice.
- **Rischio di "tutto nello store"**: lo stato locale di UI (form, toggle) NON va nello store; metterlo lì è l'errore più comune.
- **Dipendenze extra e versioni allineate** (`@ngrx/*` deve seguire la major di Angular).

### Mia raccomandazione
Dato che l'obiettivo è **imparare e portare NgRx nel progetto**, procedi con lo **Store classico** (questo corso): è il modo migliore per capire davvero il modello, ed è quello che troverai nei progetti reali. Limitalo a ciò che è *davvero condiviso*: **`user`** (lista/CRUD) e **`auth`** (sessione). Lascia fuori lo stato di UI e i form.
Quando avrai finito, valuta **`@ngrx/signals` (SignalStore)**: ha lo stesso modello mentale con molto meno boilerplate ed è il naturale successore per un'app già basata su Signals. Per un'app di queste dimensioni, in produzione sceglierei quello.

### Criterio di successo di questo corso (verificabile)
1. L'app compila e parte come prima (nessuna regressione: NgRx è aggiunto, non ancora usato dai componenti).
2. In Redux DevTools compare lo state `user` e, dispatchando a mano un'azione, lo stato cambia come atteso.
3. I test di reducer/selectors/effects passano.
4. Sai spiegare a voce il ciclo *dispatch → reducer → selector → view* e *dispatch → effect → dispatch*.

---

<a id="1-teoria"></a>
## 1. Cos'è NgRx e come ragiona

NgRx è l'implementazione Angular del pattern **Redux**: **una sola fonte di verità** (lo *store*) che contiene l'intero stato applicativo come **oggetto immutabile**. Nessuno può modificarlo direttamente: si può solo **descrivere cosa è successo** (un'*azione*) e una funzione pura (il *reducer*) calcola il nuovo stato.

```
                    ┌─────────────────────────────────────────────┐
                    │                    STORE                    │
   dispatch(action) │   state = { user: {...}, auth: {...} }      │
 ─────────────────► │        │                                    │
   (componente/     │        ▼                                    │
    effect)         │   REDUCER(stateVecchio, action) → stateNuovo│
                    └────────────────┬────────────────────────────┘
                                     │  select(selector)
                                     ▼
                                  VIEW (componenti)

   In parallelo:  action ──► EFFECT (HTTP, localStorage, router...) ──► dispatch(nuova action)
```

### I 5 concetti
| Concetto | Cos'è | Regola d'oro |
|---|---|---|
| **State** | Oggetto JSON immutabile, diviso in *slice* (`user`, `auth`) | Solo dati serializzabili; niente classi con metodi, `Date`, `Observable` |
| **Action** | Oggetto `{type, ...payload}` che descrive un **evento** ("utenti caricati") | Nomina l'*evento accaduto*, non il comando: `[User Page] Load Users`, non `setUsers` |
| **Reducer** | Funzione **pura** `(state, action) => newState` | Niente HTTP, niente `Date.now()`, niente mutazioni |
| **Selector** | Funzione pura che legge/deriva dati dallo stato, con memoizzazione | I componenti leggono **solo** tramite selector |
| **Effect** | Stream RxJS che ascolta le action, fa I/O e produce altre action | Qui vivono HTTP, snackbar, navigazione, localStorage |

### Come "gestisce" lo stato (il punto chiave)
- Lo stato non viene mai modificato: ad ogni action il reducer ritorna **un nuovo oggetto** (spread `{...state}`). I riferimenti che non cambiano restano identici → i selector capiscono cosa è cambiato con un semplice `===`, ed è per questo che i componenti si aggiornano in modo efficiente.
- Lo `Store` è essenzialmente un `BehaviorSubject` di stato + un `Subject` di action, con `scan` (come `reduce` nel tempo) in mezzo.
- Le **runtime checks** in dev congelano lo stato (`Object.freeze`): se muti per sbaglio, ottieni un errore immediato. È una funzionalità, non un fastidio.

### Da dove viene il "flusso a doppio giro" (loading → success/failure)
Un'operazione asincrona diventa **3 azioni**: `load` (parte, `loading = true`), `loadSuccess` (dati), `loadFailure` (errore). L'effect è il ponte fra la prima e le altre due.

---

<a id="2-mappa"></a>
## 2. Dove siamo partiti: mappa del codice attuale

Il tuo `UserSignalsService` è già **uno store artigianale**. Vedilo come traccia di apprendimento: ciò che fa oggi in un solo file, NgRx lo separa per responsabilità.

| Oggi (`user-signals.service.ts`) | Con NgRx |
|---|---|
| `_usersSignal`, `_isLoadingSignal`, `_paginationSignal` | **State** della slice `user` |
| `setUsers()`, `setLoading()`, `_usersSignal.update(...)` | **Reducer** (`on(...)`) |
| `users`, `isLoading`, `hasUsers` (`computed`) | **Selectors** |
| `httpClient.get(...).subscribe(...)` | **Effect** |
| `setLoading(true)` all'inizio del metodo | Action `loadUsers` + `on(loadUsers, ...)` |
| `next: ...` | Action `loadUsersSuccess` |
| `error: ...` | Action `loadUsersFailure` |
| `takeUntil(destroy$)` passato dal componente | **Non serve più**: gli effect vivono a livello di store, non di componente |
| `snackBar.notify(...)` in `error` | Effect con `{dispatch: false}` (vedi Modulo D) |
| `currentUserSignal` in `AuthenticationService` | Slice `auth` (Modulo G) |

> ⚠️ **Due osservazioni sul codice esistente da conoscere prima di partire** (non le correggo io, ma ti mordono negli effect):
> 1. In `UserService`, `getUserList` usa `catchError(error => this.handleError(error))` (corretto), ma gli altri metodi usano `catchError(this.handleError)`: la funzione viene passata **slegata da `this`**, quindi dentro `handleError` `this.snackBarNotificationService` è `undefined` e l'errore reale viene sostituito da un `TypeError`. Negli effect vedresti un `error.error` `undefined`. Fix a una riga per metodo: `catchError(err => this.handleError(err))` (stesso stile di `getUserList`). Consiglio di farlo prima del Modulo D.
> 2. `UserService.handleError` **mostra già la snackbar**. Se anche un effect la mostra, l'utente vedrà due notifiche. Nel corso l'effect *non* notifica (le notifiche restano nel servizio) e ti mostro il pattern nel riquadro "estensione".

---

<a id="modulo-a"></a>
## Modulo A – Installazione

**Obiettivo:** avere i pacchetti alla versione allineata ad Angular 20.

### Pacchetti
| Pacchetto | A cosa serve |
|---|---|
| `@ngrx/store` | Store, actions, reducer, selectors (il nucleo) |
| `@ngrx/effects` | Effects |
| `@ngrx/entity` | Helper per collezioni normalizzate (Modulo H, opzionale ma lo installiamo ora) |
| `@ngrx/store-devtools` | Integrazione con Redux DevTools |

### Comandi
```bash
npm install @ngrx/store@^20 @ngrx/effects@^20 @ngrx/entity@^20 @ngrx/store-devtools@^20
```

> `angular.json` dichiara ancora `"packageManager": "pnpm"` (in `cli`). Siccome usi npm, cambialo in `"npm"`: altrimenti `ng add`/`ng update` useranno pnpm e genereranno un secondo lockfile.

> **Perché a mano e non `ng add @ngrx/store`?** Lo schematic modifica `app.config.ts` e crea file per te: comodo, ma nasconde proprio ciò che vuoi imparare. Fai a mano almeno la prima volta.

Installa anche l'estensione **Redux DevTools** per Chrome/Edge (serve dal Modulo B).

### Verifica
- `package.json` contiene le 4 dipendenze con major `20`.
- `ng build` (o `npm run start-local`) compila senza errori. Nulla è cambiato a runtime.

### Mini-quiz
1. Perché la major di `@ngrx/*` deve coincidere con quella di `@angular/core`? *(Risposta: NgRx dichiara Angular come peer dependency e sfrutta API interne/Signals della versione corrispondente.)*

---

<a id="modulo-b"></a>
## Modulo B – Bootstrap dello store + DevTools

**Obiettivo:** avere uno store root **vuoto** ma attivo, visibile in DevTools. Il progetto è standalone (nessun `AppModule`), quindi si usano le funzioni `provide*` in `app.config.ts`.

### Cosa scrivere
File: `src/app/app.config.ts` — aggiungi gli import e tre provider:

```ts
import {ApplicationConfig, isDevMode} from '@angular/core';
import {provideStore} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {provideStoreDevtools} from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpSecurityInterceptor])),
    provideAnimations(),

    provideStore(),                       // store root, per ora senza slice
    provideEffects(),                     // abilita il sistema di effects
    provideStoreDevtools({
      maxAge: 25,                         // quante azioni tenere nella cronologia
      logOnly: !isDevMode(),              // in produzione: sola lettura, niente time travel
      connectInZone: true,                // l'app usa zone.js
    }),
  ],
};
```

### Cosa succede qui
- `provideStore()` crea lo `Store` come singleton root. Accetta `(reducers, config)`: per ora `{}` implicito.
- `provideEffects()` senza argomenti inizializza l'infrastruttura; gli effect veri li registreremo per feature.
- Le **runtime checks** in dev controllano di default solo l'**immutabilità** di stato e azioni. I controlli di **serializzabilità** sono *disattivati* di default: per impararli conviene accenderli (è una correzione rispetto alla prima versione della guida):
  ```ts
  provideStore({}, {
    runtimeChecks: {strictStateSerializability: true, strictActionSerializability: true},
  }),
  ```
  Così, se metti nello store un `HttpErrorResponse`, una `Date` o un'istanza di classe, ricevi subito un errore in console.

### Verifica
1. Avvia l'app (`npm run start-local`) e aprila nel browser.
2. Apri DevTools → tab **Redux**. Devi vedere l'azione `@ngrx/store/init` e lo stato `{}`.
3. Nessun errore in console.

### Mini-quiz
1. Perché non ci sono reducer in `provideStore()`? *(Perché le slice verranno registrate a livello di feature con `provideState`, in lazy loading.)*
2. Cosa cambia con `logOnly: !isDevMode()`? *(In prod DevTools non permette di alterare lo stato.)*

---

<a id="modulo-c"></a>
## Modulo C – La prima slice: `user`

**Obiettivo:** definire stato, azioni, reducer e selector della lista utenti, seguendo la struttura per feature del progetto.

### Struttura file (nuova cartella `store/` dentro la feature)

```
src/app/features/user/store/
  user.actions.ts
  user.reducer.ts      // contiene anche userFeature (createFeature)
  user.selectors.ts    // solo selector aggiuntivi/derivati
  user.effects.ts      // Modulo D
```

### C1. Actions — `user.actions.ts`

`createActionGroup` genera creator e tipi (`'[User] Load Users'`) da un oggetto di eventi.

```ts
import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {User} from '../models/user';
import {PagedResponse} from '../../../shared/models/paged-response';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Load Users': props<{ currentUserId: number | undefined; email: string; page: number; size: number }>(),
    'Load Users Success': props<{ response: PagedResponse<User> }>(),
    'Load Users Failure': props<{ error: string }>(),

    'Add User': props<{ user: Partial<User> }>(),
    'Add User Success': props<{ user: User }>(),
    'Add User Failure': props<{ error: string }>(),

    'Update User': props<{ id: number; user: Partial<User> }>(),
    'Update User Success': props<{ user: User }>(),
    'Update User Failure': props<{ error: string }>(),

    'Delete User': props<{ id: number }>(),
    'Delete User Success': props<{ id: number }>(),
    'Delete User Failure': props<{ error: string }>(),

    'Clear Users': emptyProps(),
  },
});
```

Note di stile:
- Il nome è un **evento**: "Load Users Success" = *"è successo che gli utenti sono stati caricati"*.
- `error: string` (non `HttpErrorResponse`): le azioni devono essere **serializzabili**; `HttpErrorResponse` no, e con `strictActionSerializability` attivo (vedi Modulo B) le runtime checks lo segnalerebbero.
- Il `source` (`'User'`) finisce nel tipo: `[User] Load Users`. Quando le azioni arriveranno da componenti diversi puoi usare sorgenti più fini (`'User List Page'`, `'User API'`).

### C2. State + Reducer — `user.reducer.ts`

`createFeature` è la via moderna: dal nome e dal reducer genera **automaticamente** la chiave della slice e un selector per ogni proprietà (`selectUsers`, `selectLoading`, `selectPagination`, `selectError`, più `selectUserState`).

```ts
import {createFeature, createReducer, on} from '@ngrx/store';
import {User} from '../models/user';
import {UserActions} from './user.actions';

export interface UserState {
  users: User[];
  pagination: { totalElements: number; totalPages: number; pageSize: number; pageNumber: number };
  loading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  users: [],
  pagination: {totalElements: 0, totalPages: 0, pageSize: 10, pageNumber: 0},  // gli stessi default di UserSignalsService
  loading: false,
  error: null,
};

export const userFeature = createFeature({
  name: 'user',                                  // chiave nello state globale: state.user
  reducer: createReducer(
    initialUserState,

    // qualsiasi operazione parte: loading on, errore azzerato
    on(
      UserActions.loadUsers,
      UserActions.addUser,
      UserActions.updateUser,
      UserActions.deleteUser,
      (state) => ({...state, loading: true, error: null}),
    ),

    on(UserActions.loadUsersSuccess, (state, {response}) => ({
      ...state,
      users: response.content,
      pagination: {
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        pageSize: response.size,
        pageNumber: response.number,
      },
      loading: false,
    })),

    on(UserActions.addUserSuccess, (state, {user}) => ({
      ...state,
      users: [...state.users, user],
      loading: false,
    })),

    on(UserActions.updateUserSuccess, (state, {user}) => ({
      ...state,
      users: state.users.map(u => (u.id === user.id ? user : u)),
      loading: false,
    })),

    on(UserActions.deleteUserSuccess, (state, {id}) => ({
      ...state,
      users: state.users.filter(u => u.id !== id),
      loading: false,
    })),

    // qualsiasi fallimento
    on(
      UserActions.loadUsersFailure,
      UserActions.addUserFailure,
      UserActions.updateUserFailure,
      UserActions.deleteUserFailure,
      (state, {error}) => ({...state, loading: false, error}),
    ),

    on(UserActions.clearUsers, (state) => ({...state, users: []})),
  ),
});
```

Confronta riga per riga con `UserSignalsService`: è la stessa logica (`set`, `update(map/filter)`), ma **priva di HTTP e di side effect**.

> **Perché `{...state, ...}` e non `state.users.push(...)`?** Il reducer deve restituire un nuovo oggetto; la mutazione è vietata (e in dev viene bloccata dal freeze).

### C3. Selectors derivati — `user.selectors.ts`

I selector base li hai già da `userFeature`. Qui aggiungi solo quelli **derivati** (equivalenti di `hasUsers`):

```ts
import {createSelector} from '@ngrx/store';
import {userFeature} from './user.reducer';

export const selectHasUsers = createSelector(
  userFeature.selectUsers,
  (users) => users.length > 0,
);
```

`createSelector(input1, input2, ..., projector)` ricalcola `projector` solo se gli input cambiano riferimento (**memoizzazione**).

### Verifica
- `ng build` compila: i tipi delle azioni e del reducer sono coerenti (`response.content`, ecc. sono verificati dal compilatore).
- Non è ancora registrato nell'app: per vederlo in azione serve il Modulo E.

### Mini-quiz
1. Perché `loadUsers`, `addUser`, `updateUser`, `deleteUser` possono condividere lo stesso `on(...)`? *(Tutte fanno partire un'operazione: stessa conseguenza sullo stato.)*
2. Cosa succederebbe se `on(addUserSuccess)` facesse `state.users.push(user)`? *(Errore di runtime check in dev; in prod, bug silenziosi: il riferimento all'array non cambia e i selector non si accorgono del cambio.)*

---

<a id="modulo-d"></a>
## Modulo D – Effects: gli effetti collaterali

**Obiettivo:** far sì che l'azione `loadUsers` scateni la chiamata HTTP e produca `loadUsersSuccess`/`loadUsersFailure`.

Useremo i **functional effects** (moderni, in linea con il tuo `httpSecurityInterceptor` funzionale): una `const` con `createEffect(() => ..., {functional: true})`, dipendenze prese con `inject`.

### `user.effects.ts`

```ts
import {inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map, of, switchMap} from 'rxjs';
import {UserService} from '../services/user.service';
import {UserActions} from './user.actions';

export const loadUsers = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) =>
    actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(({currentUserId, email, page, size}) =>
        userService.getUserListExceptCurrent(currentUserId, email, page, size).pipe(
          map(response => UserActions.loadUsersSuccess({response})),
          catchError((error: HttpErrorResponse) =>
            of(UserActions.loadUsersFailure({error: String(error.error)})),
          ),
        ),
      ),
    ),
  {functional: true},
);

export const deleteUser = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) =>
    actions$.pipe(
      ofType(UserActions.deleteUser),
      exhaustMap(({id}) =>
        userService.deleteUser(id).pipe(
          map(() => UserActions.deleteUserSuccess({id})),
          catchError((error: HttpErrorResponse) =>
            of(UserActions.deleteUserFailure({error: String(error.error)})),
          ),
        ),
      ),
    ),
  {functional: true},
);
```

### 🧑‍💻 Esercizio per te
Scrivi tu `addUser` (usa `userService.createUser(user)` → `addUserSuccess({user})`) e `updateUser` (usa `userService.updateUser(id, user)` → `updateUserSuccess({user})`). Copia lo schema di `deleteUser`. Ti serve decidere l'operatore: vedi sotto.

### La scelta dell'operatore (concetto fondamentale)
| Operatore | Comportamento se arriva una nuova action mentre la precedente è in corso | Usalo per |
|---|---|---|
| `switchMap` | **Annulla** la precedente, vale l'ultima | Letture/ricerche/paginazione (`loadUsers`) |
| `exhaustMap` | **Ignora** le nuove finché la corrente non finisce | Scritture che non devono duplicarsi (`add`, `delete`, login) |
| `concatMap` | Le mette **in coda** in ordine | Scritture in cui conta l'ordine (`update` sequenziali) |
| `mergeMap` | Le esegue **in parallelo** | Operazioni indipendenti, raramente serve |

### Regola d'oro: `catchError` va DENTRO il `switchMap`
Se lo metti fuori, al primo errore l'intero stream dell'effect **muore** e non reagirà più a nessuna action. Dentro, muore solo la chiamata interna e l'effect resta vivo.

### Estensione (opzionale): effect di sola notifica con `dispatch: false`
Un effect che non produce azioni deve dichiararlo, altrimenti riemette la stessa action all'infinito:

```ts
export const notifyError = createEffect(
  (actions$ = inject(Actions), snackBar = inject(SnackBarNotificationService)) =>
    actions$.pipe(
      ofType(UserActions.loadUsersFailure /*, ...altre failure */),
      tap(({error}) => snackBar.notify(error, 'OK', NotificationTypeEnum.ERROR)),
    ),
  {functional: true, dispatch: false},
);
```
Usalo **solo se** rimuovi prima la notifica da `UserService.handleError`, altrimenti duplichi la snackbar (vedi Modulo 2).

### Verifica
- `ng build` compila.
- Ancora nulla gira a runtime finché non registri gli effect (Modulo E).

### Mini-quiz
1. Perché non serve più `takeUntil(destroy$)`? *(L'effect non è legato al ciclo di vita di un componente: è un singleton dello store. Il componente si limita a fare `dispatch` e a selezionare.)*
2. Perché `loadUsers` usa `switchMap` e `deleteUser` `exhaustMap`? *(Cambio pagina rapido: importa l'ultima; doppio click su "elimina": non voglio due DELETE.)*

---

<a id="modulo-e"></a>
## Modulo E – Registrare la slice (lazy) e verificare con DevTools

**Obiettivo:** far conoscere allo store la slice `user` e i suoi effect **solo quando la feature viene caricata**, coerentemente con il lazy loading già presente (`loadChildren` + `routes.ts` di feature).

### Cosa scrivere
Apri `src/app/features/user/routes.ts`. Sulla **route padre** della feature aggiungi `providers` (i provider di una route sono creati in un *environment injector* dedicato, condiviso da tutte le sue figlie):

```ts
import {Routes} from '@angular/router';
import {provideState} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {userFeature} from './store/user.reducer';
import * as userEffects from './store/user.effects';

export const routes: Routes = [
  {
    path: '',
    providers: [
      provideState(userFeature),
      provideEffects(userEffects),   // registra tutti gli effect esportati dal file
    ],
    children: [
      // ...le tue route attuali di user, invariate
    ],
  },
];
```

> Se le route esistenti sono un array piatto, avvolgile in una route padre `path: ''` con `children`, come sopra. Non cambiano gli URL.

### Comportamento da conoscere
- La slice `user` **non esiste** nello state finché non navighi nella feature user; da quel momento è registrata e resta.
- Al momento della registrazione compare l'azione `@ngrx/store/update-reducers` in DevTools.

### Verifica con DevTools (senza toccare i componenti)
1. Avvia l'app, fai login, naviga nella sezione utenti.
2. Tab **Redux** → **State**: deve comparire `user: { users: [], pagination: {...}, loading: false, error: null }`.
3. In DevTools apri il **Dispatcher** (icona in basso) e invia:
   ```json
   {"type": "[User] Clear Users"}
   ```
   Lo state non cambia perché era già vuoto: ma l'azione compare nella lista → il ciclo funziona.
4. Invia a mano un evento con payload per vedere il reducer al lavoro, ad esempio:
   ```json
   {"type": "[User] Add User Success", "user": {"id": 999, "email": "test@test.it", "firstName": "Test", "lastName": "Test", "role": "USER", "authorities": [], "token": ""}}
   ```
   In **State** → `user.users` deve contenere l'utente. Con **Diff** vedi cosa è cambiato e con lo **slider** (time travel) puoi tornare indietro.
5. Per provare l'effect: invia `{"type": "[User] Load Users", "currentUserId": 1, "email": "x@x.it", "page": 0, "size": 10}`. Con il backend attivo, la tab **Network** mostra la chiamata a `users/not-current` e in Redux vedi `Load Users` → `Load Users Success` con `loading` che passa da `true` a `false`.

> È il modo migliore per **capire davvero** NgRx: guardi lo stato reagire senza nessun componente.

### Mini-quiz
1. Perché registrare in `routes.ts` e non in `app.config.ts`? *(Lazy loading: il codice della slice viaggia nel chunk della feature e non pesa sul bundle iniziale.)*
2. Cosa succede se una guard di *altra* feature legge `state.user` prima di visitare la feature user? *(Slice `undefined` → errori nei selector. Ciò che serve globalmente, come `auth`, va registrato in `app.config.ts`. Vedi Modulo G.)*

---

<a id="modulo-f"></a>
## Modulo F – Test

**Obiettivo:** testare senza componenti né TestBed: reducer e selector sono funzioni pure.

> Come da convenzione del progetto, i test li lanci tu: `ng test --include='**/user.reducer.spec.ts'`.

### F1. Reducer — `user.reducer.spec.ts`

```ts
import {initialUserState, userFeature} from './user.reducer';
import {UserActions} from './user.actions';
import {User} from '../models/user';

describe('user reducer', () => {
  const reducer = userFeature.reducer;
  const user = {id: 1, email: 'a@a.it'} as User;

  it('loadUsers imposta loading e azzera error', () => {
    const state = reducer({...initialUserState, error: 'x'}, UserActions.loadUsers({
      currentUserId: 1, email: 'a@a.it', page: 0, size: 10,
    }));
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('addUserSuccess aggiunge l\'utente senza mutare lo stato precedente', () => {
    const before = {...initialUserState, loading: true};
    const after = reducer(before, UserActions.addUserSuccess({user}));
    expect(after.users).toEqual([user]);
    expect(before.users).toEqual([]);       // immutabilità
    expect(after.loading).toBeFalse();
  });

  it('deleteUserSuccess rimuove per id', () => {
    const before = {...initialUserState, users: [user]};
    expect(reducer(before, UserActions.deleteUserSuccess({id: 1})).users).toEqual([]);
  });
});
```
🧑‍💻 **Esercizio:** aggiungi i test di `loadUsersSuccess` (paginazione mappata correttamente), `updateUserSuccess` e `*Failure`.

### F2. Selector — `user.selectors.spec.ts`
I selector derivati si testano col metodo `.projector`, che salta lo store e testa solo la funzione di proiezione:

```ts
import {selectHasUsers} from './user.selectors';
import {User} from '../models/user';

describe('selectHasUsers', () => {
  it('false con lista vuota', () => expect(selectHasUsers.projector([])).toBeFalse());
  it('true con almeno un utente', () => expect(selectHasUsers.projector([{id: 1} as User])).toBeTrue());
});
```

### F3. Effect (versione semplice con `provideMockActions`)
Test tipico: `provideMockActions(() => of(UserActions.loadUsers(...)))`, un `UserService` finto con `jasmine.createSpyObj`, e verifichi che l'effect emetta `loadUsersSuccess`. Per farlo, chiama l'effect funzionale con dipendenze passate a mano:

```ts
const result$ = loadUsers(of(UserActions.loadUsers({currentUserId: 1, email: 'a', page: 0, size: 10})), fakeUserService);
result$.subscribe(action => expect(action).toEqual(UserActions.loadUsersSuccess({response})));
```
(Sfrutti il fatto che i parametri dell'effect hanno come default `inject(...)`: in test li sostituisci passando tu gli argomenti.)

### Mini-quiz
1. Perché i test del reducer sono molto più semplici di quelli del vecchio servizio? *(Nessun `HttpClient`, nessun TestBed, nessun `subscribe`: `input → output`.)*

---

<a id="modulo-g"></a>
## Modulo G – Slice `auth` a livello root + meta-reducer di logout (esercizio guidato)

> ⏸️ **Rimandato.** La Parte 2 non dipende da questo modulo: `AuthenticationService.currentUserSignal` resta com'è.

**Obiettivo:** portare la sessione (`currentUserSignal`) nello store. Qui ti do lo scheletro e le decisioni; scrivi tu il codice, usando il Modulo C-D come modello.

### Perché è diverso da `user`
- Serve **a livello root**: le guard e l'interceptor girano prima e fuori da qualsiasi feature. Registrala in `app.config.ts` con `provideState(authFeature)` e `provideEffects(authEffects)`.
- Ha un vincolo importante nel progetto attuale: il token vive in `localStorage`, e `httpSecurityInterceptor` lo legge **direttamente da lì**. Non cambiare questa cosa adesso: lo store non deve sostituire il token letto dall'interceptor in questo step.

### Stato consigliato
```ts
interface AuthState {
  user: User | null;            // null = non autenticato
  status: 'unknown' | 'authenticated' | 'unauthenticated';   // sostituisce il tri-stato undefined/null/User
  loading: boolean;
  error: string | null;
}
```
> Oggi `currentUserSignal` è `User | undefined | null` e `isLoggedIn()` è `!== undefined`. Nota: dopo `logout()` è `undefined`, ma un fetch fallito dell'utente non lo azzera. Nello stato `status` esplicito rendi questi casi **non ambigui**.

### Azioni suggerite
`Login` (props `LoginRequest`) → `Login Success` (props `user`) / `Login Failure`; `Restore Session` (equivale a `isAuthenticated()`: rilegge l'utente da `userId` in localStorage) → `Restore Session Success` / `Failure`; `Logout`.

### Effects suggeriti
- `login`: `exhaustMap` → `authenticationService.authenticate(...)`.
- Un effect `dispatch: false` che su `loginSuccess` scrive `token` e `userId` in `localStorage` (è un side effect: mai nel reducer).
- Un effect `dispatch: false` che su `logout` fa `localStorage.clear()` e naviga a `/login` con `Router`.

### Meta-reducer per azzerare tutto al logout
Un **meta-reducer** avvolge il reducer root e intercetta ogni azione. Al logout restituisce lo stato `undefined`, che fa ripartire *tutte* le slice dai valori iniziali (nessun dato utente residuo per il prossimo che fa login):

```ts
import {ActionReducer, MetaReducer} from '@ngrx/store';
import {AuthActions} from '../../security/store/auth.actions';

export function clearStateOnLogout(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) =>
    reducer(action.type === AuthActions.logout.type ? undefined : state, action);
}

// app.config.ts
provideStore({}, {metaReducers: [clearStateOnLogout]}),
```
Nota: il meta-reducer azzera le slice **già registrate**; quelle lazy non ancora caricate ripartono comunque pulite.

### Come lo useremo poi (anticipo)
- `AuthenticationService.currentUserSignal` diventerà `store.selectSignal(authFeature.selectUser)`.
- `authGuard` farà dispatch di `Restore Session` e aspetterà l'esito (es. `store.select(selectStatus).pipe(filter(s => s !== 'unknown'), take(1), map(...))`).
Non farlo ora: è parte dello step successivo.

### Verifica
- DevTools: dopo un login manuale (dispatch di `[Auth] Login Success` con un finto utente) `auth.status` diventa `authenticated`; dopo `[Auth] Logout` lo state torna ai valori iniziali.

---

<a id="modulo-h"></a>
## Modulo H – Entity adapter (opzionale)

**Quando serve:** quando le liste diventano tante o lo stesso elemento compare in più punti. `@ngrx/entity` memorizza le collezioni **normalizzate** `{ids: [], entities: {id: item}}` con operazioni pronte (`addOne`, `upsertOne`, `removeOne`, `setAll`...) e selector (`selectAll`, `selectEntities`, `selectTotal`).

Per la lista utenti paginata **non è necessario** (sostituisci l'intera pagina a ogni caricamento): implementalo come esercizio bonus, o riservalo a `categories`/`vocabulary` dove ha più senso. Traccia:

```ts
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';

export interface UserState extends EntityState<User> { loading: boolean; error: string | null; /* pagination */ }
export const adapter: EntityAdapter<User> = createEntityAdapter<User>();   // selectId = 'id' di default
const initialState = adapter.getInitialState({loading: false, error: null /*, pagination */});

// nel reducer:
on(UserActions.loadUsersSuccess, (state, {response}) => adapter.setAll(response.content, {...state, loading: false}))
on(UserActions.deleteUserSuccess, (state, {id}) => adapter.removeOne(id, {...state, loading: false}))

// createFeature:
extraSelectors: ({selectUserState}) => adapter.getSelectors(selectUserState),  // selectAll, selectEntities, selectTotal, selectIds
```

---

<a id="trappole"></a>
## Trappole comuni

1. **Mutare lo stato** (`push`, `state.x = ...`). Sempre spread/`map`/`filter`.
2. **Side effect nel reducer** (HTTP, `localStorage`, `Date.now()`, `Math.random()`): vietato. Vanno negli effect o nell'action (es. l'id/timestamp lo generi prima del dispatch).
3. **Effect senza `dispatch: false`** che non emette azioni → loop infinito o errore.
4. **`catchError` fuori dal `switchMap`**: l'effect muore al primo errore.
5. **Azioni "comando"** (`setUsers`) invece di eventi: perdi la tracciabilità (chi/perché?). Un evento può essere gestito da più reducer/effect; un comando è accoppiato a uno.
6. **Mettere tutto nello store**: stato di form, apertura di dialog, tab selezionato → restano locali (`signal`). Regola: *"serve a più di un componente non correlato, o va tracciato/ripristinato?"* Se no, non è stato globale.
7. **Oggetti non serializzabili nello store/azioni** (`HttpErrorResponse`, `Date`, classi con metodi, `Observable`). Nota: `User` è una *class* ma usata solo come tipo: da HTTP arrivano oggetti semplici, quindi va bene.
8. **Leggere una slice lazy prima che sia registrata** (vedi Modulo E, quiz 2).
9. **Selector con `map` nei componenti** al posto di `createSelector`: perdi memoizzazione e riuso.
10. **Dimenticare `provideEffects` per feature**: le azioni partono ma nessuno risponde.

---

<a id="cheat"></a>
## Cheat sheet e glossario

```ts
// Definire
const A = createActionGroup({source: 'X', events: {'Do Thing': props<{id: number}>()}});
const feature = createFeature({name: 'x', reducer: createReducer(init, on(A.doThing, (s, {id}) => ({...s, id})))});
const sel = createSelector(feature.selectId, id => id * 2);

// Registrare
provideStore({}, {metaReducers: []});      // app.config.ts
provideState(feature);                      // routes.ts (lazy) o app.config.ts (root)
provideEffects(effects);                    // idem

// Usare (step successivo, nei componenti)
private store = inject(Store);
value = this.store.selectSignal(feature.selectId);   // Signal<T>
value$ = this.store.select(feature.selectId);        // Observable<T>
this.store.dispatch(A.doThing({id: 1}));
```

| Termine | Significato |
|---|---|
| Slice / Feature state | Sotto-albero di stato con un reducer (`state.user`) |
| Action | Evento `{type, payload}` |
| Reducer | Funzione pura `(state, action) → state` |
| Meta-reducer | Reducer che avvolge il reducer root (logout, logging, persistenza) |
| Selector | Funzione pura memoizzata di lettura/derivazione |
| Effect | Stream RxJS che reagisce ad azioni per fare I/O |
| Memoizzazione | Cache dell'ultimo risultato: ricalcola solo se cambiano gli input |
| Runtime checks | Controlli in dev su immutabilità/serializzabilità |
| Normalizzazione | Salvare le collezioni come `{ids, entities}` |

---


# Parte 2 – Integrazione nei componenti

> Obiettivo: i componenti della feature `user` smettono di chiamare `UserSignalsService`/`UserService` direttamente e parlano **solo con lo store** (`dispatch` per scrivere, `selectSignal` per leggere).
> Il Modulo G (auth) resta rimandato: `AuthenticationService` e le guard non si toccano.

<a id="revisione"></a>
## 13. Revisione della tua implementazione A–F

Ho riletto i tuoi file. Legenda: ✅ ok · ❌ da correggere prima della Parte 2 · 🧹 pulizia.

| # | Dove | Esito |
|---|---|---|
| 1 | Modulo A – dipendenze `@ngrx/*@^20.1.0` | ✅ |
| 2 | Modulo B – `app.config.ts` | ✅ (valuta di accendere i controlli di serializzabilità, vedi Modulo B aggiornato) |
| 3 | Modulo C1 – `user.actions.ts` | ✅ |
| 4 | Modulo C2 – `user.reducer.ts` | ❌ **mancano tre `on(...)`** (dettagli sotto) |
| 5 | Modulo C3 – `user.selectors.ts` | ✅ |
| 6 | Modulo D – `user.effects.ts` | ✅ `exhaustMap` per add/delete e `concatMap` per update sono scelte corrette |
| 7 | `UserService` – `catchError(this.handleError)` | ❌ **ora è bloccante** (dettagli sotto) |
| 8 | Modulo E – `routes.ts` + `app.routes.ts` | ✅ con una nota sul guard |
| 9 | Modulo F – test | ✅ il test dell'effect con il caso di errore è fatto bene |
| 10 | `bash.exe.stackdump` nella root | 🧹 è un crash dump di Git Bash: cancellalo, non committarlo |
| 11 | `angular.json` → `cli.packageManager: "pnpm"` | 🧹 cambialo in `"npm"` (vedi Modulo A) |

### ❌ 4. Il reducer non gestisce `addUserSuccess`, `updateUserSuccess`, `deleteUserSuccess`

**Causa:** nel tuo `createReducer` ci sono l'`on` di "partenza" (che mette `loading: true`), `loadUsersSuccess`, le failure e `clearUsers`. Mancano i tre `on` di successo del Modulo C2.

**Conseguenze concrete:**
- Dopo un add/update/delete riuscito, `loading` resta **`true` per sempre**: l'unica cosa che lo rimette a `false` per quelle operazioni sono le failure.
- La lista nello store non si aggiorna (l'utente cancellato resta visibile).
- Due dei tuoi test (`addUserSuccess aggiunge l'utente...` e `deleteUserSuccess rimuove per id`) **falliscono**. I tuoi test te lo stavano già dicendo: lanciali ora.

**Fix:** copia i tre `on(...)` dal Modulo C2 (`addUserSuccess`, `updateUserSuccess`, `deleteUserSuccess`).

**Verifica:**
1. `ng test --include='**/user.reducer.spec.ts'`: prima del fix 2 test rossi, dopo tutti verdi.
2. In DevTools, dispatch di `{"type": "[User] Add User Success", "user": {"id": 999, "email": "t@t.it"}}`: l'utente compare in `user.users`.

### ❌ 7. `catchError(this.handleError)` in `UserService`

Era già segnalato nel capitolo 2, ma ora diventa bloccante: gli effect chiamano proprio `getUserListExceptCurrent`, `createUser`, `getUserById`, `updateUser` e `deleteUser`, cioè i metodi che usano la forma sbagliata.

**Cosa succede con un errore HTTP (per esempio un 400):**
1. RxJS chiama `handleError` come funzione "sciolta", quindi `this` è `undefined` (i moduli ES sono in strict mode).
2. `this.snackBarNotificationService` lancia `TypeError: Cannot read properties of undefined`.
3. La snackbar non compare. L'effect riceve il `TypeError` al posto dell'`HttpErrorResponse`, quindi `error.error` vale `undefined` e nello store finisce `error: "undefined"`.

**Fix:** in quei metodi scrivi `catchError(err => this.handleError(err))`, come già fa `getUserList`. L'arrow function mantiene il `this` del servizio.

**Verifica:** spegni il backend, oppure crea un utente con un'email già esistente. Deve comparire la snackbar con il messaggio del backend e in DevTools deve apparire `[User] ... Failure` con un `error` leggibile, non `"undefined"`.

### ✅ 8. Nota sul guard (non è un errore)
Prima `authGuard` stava su ogni route, ora sta solo sulla route padre `''`. Angular riusa la route padre quando navighi fra le figlie (da `/users` a `/user-detail/1`), quindi il guard **gira una sola volta**, quando entri nella feature, e non a ogni navigazione. Per l'app va bene: `currentUserSignal` resta valorizzato. Se vuoi il comportamento di prima, aggiungi `canActivateChild: [authGuard]` sulla route padre: la firma della funzione è compatibile.

---

<a id="modulo-i"></a>
## Modulo I – Come un componente parla con lo store (teoria)

### Le tre regole
1. **Leggere:** `store.selectSignal(selector)` restituisce un `Signal<T>`, che si usa nel template come i signal che già conosci (`users()`). Non serve nessun `subscribe`, `async` pipe o `destroy$`.
2. **Scrivere:** `store.dispatch(Action)` è **fire-and-forget**: restituisce `void`. Il componente dichiara *cosa è successo* ("l'utente ha chiesto la pagina 2") e non sa quando o come finirà.
3. **Reagire all'esito:** siccome `dispatch` non restituisce nulla, ciò che prima stava nel `next:` del `subscribe` (snackbar, navigazione) **si sposta in un effect** con `dispatch: false`. È il cambio mentale più grosso della Parte 2.

```
 COMPONENTE                         STORE                                  BACKEND
 ───────────                        ─────                                  ───────
 click "Add" ──dispatch(addUser)──► reducer: loading=true
                                    effect addUser ──createUser()───────► POST /users
                                                   ◄────────── 201 ──────
                                    dispatch(addUserSuccess)
                                    reducer: users+=, loading=false
                                    effect notifyAndNavigateAfterSave:
                                         snackbar + router.navigate('/users')
 template ◄── selectSignal(selectLoading) aggiornato
```

### Cosa resta nel componente (e non va nello store)
| Resta locale | Perché |
|---|---|
| Il `FormGroup` di `new-user-add` | È una **bozza**, non un dato del server; vive e muore con la pagina |
| `filterEmail` in `user-list` | È stato di UI di una sola pagina |
| `MatDialog`, `MatPaginator`, `MatSort` | Sono oggetti UI (non serializzabili) |
| Il subscribe a `dialogRef.afterClosed()` | È un evento UI; si completa da solo quando il dialog si chiude |
| Il subscribe a `activatedRoute.paramMap` | È routing, non stato applicativo (il suo `destroy$` resta) |

### Ordine di lavoro
J (estendi lo store) → K (lista: lettura) → L (lista: delete) → M (dettaglio) → N (form) → O (pulizia) → P (test).
Dopo ogni modulo l'app deve compilare e funzionare: si migra **un componente alla volta**.

### Mini-quiz
1. Perché la snackbar "User created successfully" non può restare nel componente dopo `dispatch(addUser)`? *(Il `dispatch` ritorna subito: il componente non sa se e quando il POST è riuscito. Solo chi osserva `addUserSuccess`, cioè un effect, lo sa.)*

---

<a id="modulo-j"></a>
## Modulo J – Estendere lo store per i componenti

Due pagine (`user-detail` e `user-edit`) caricano **un singolo utente per id**. Oggi lo fanno con `userService.getUserById` direttamente nel componente. Serve un pezzo di stato in più: `selectedUser`.

> **Perché non basta cercare l'utente in `state.users`?** Perché la lista è **paginata**: se apri `/user-detail/42` da un link o con F5, l'utente 42 potrebbe non essere nella pagina caricata, o la lista potrebbe essere vuota. Un selector come `selectUserById(42)` funzionerebbe solo "a volte".

### J1. Actions — `user.actions.ts`
Aggiungi nel gruppo:
```ts
'Load User': props<{ id: number }>(),
'Load User Success': props<{ user: User }>(),
'Load User Failure': props<{ error: string }>(),
```

### J2. State e reducer — `user.reducer.ts`
```ts
export interface UserState {
  // ...campi esistenti
  selectedUser: User | null;
}

export const initialUserState: UserState = {
  // ...valori esistenti
  selectedUser: null,
};
```
Nel `createReducer`:
```ts
// NON aggiungerla alla lista dell'on "di partenza": qui serve anche azzerare selectedUser
on(UserActions.loadUser, (state) => ({...state, selectedUser: null, loading: true, error: null})),

on(UserActions.loadUserSuccess, (state, {user}) => ({...state, selectedUser: user, loading: false})),
```
Aggiungi invece `UserActions.loadUserFailure` alla lista delle failure.

> **Perché `selectedUser: null` quando parte il caricamento?** Senza reset, se apri il dettaglio di Mario, torni indietro e apri quello di Luca, vedresti **Mario per un attimo** finché la GET di Luca non risponde (lo store è un singleton e ricorda l'ultimo valore). È un bug classico degli store globali.

Il selector `userFeature.selectSelectedUser` **lo genera `createFeature` in automatico**: non devi scriverlo.

### J3. Effects — `user.effects.ts`

**Caricamento del singolo utente** (con `switchMap`, perché è una lettura: se cambi id conta solo l'ultimo):
```ts
export const loadUser = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) =>
    actions$.pipe(
      ofType(UserActions.loadUser),
      switchMap(({id}) =>
        userService.getUserById(id).pipe(
          map(user => UserActions.loadUserSuccess({user})),
          catchError((error: HttpErrorResponse) =>
            of(UserActions.loadUserFailure({error: String(error.error)})),
          ),
        ),
      ),
    ),
  {functional: true},
);
```

**Effect di UI** (`dispatch: false`): sostituiscono il codice che oggi sta nel `next:` dei componenti.
```ts
import {Router} from '@angular/router';
import {tap} from 'rxjs';
import {SnackBarNotificationService} from '../../../shared/services/snack-bar-notification.service';
import {NotificationTypeEnum} from '../../../shared/enums/notification-type.enum';

export const notifyAndNavigateAfterSave = createEffect(
  (actions$ = inject(Actions), router = inject(Router), snackBar = inject(SnackBarNotificationService)) =>
    actions$.pipe(
      ofType(UserActions.addUserSuccess, UserActions.updateUserSuccess),
      tap(action => {
        const message = action.type === UserActions.addUserSuccess.type
          ? 'User created successfully'
          : 'User updated successfully';
        snackBar.notify(message, 'OK', NotificationTypeEnum.SUCCESS);
        router.navigate(['/users']).then();
      }),
    ),
  {functional: true, dispatch: false},
);

export const notifyAfterDelete = createEffect(
  (actions$ = inject(Actions), snackBar = inject(SnackBarNotificationService)) =>
    actions$.pipe(
      ofType(UserActions.deleteUserSuccess),
      tap(() => snackBar.notify('User deleted', 'OK', NotificationTypeEnum.INFO)),
    ),
  {functional: true, dispatch: false},
);
```

> ⚠️ In `routes.ts` usi `provideEffects(userEffects)` con `import * as userEffects`: **ogni export** di `user.effects.ts` viene trattato come effect. Non esportare da quel file costanti o funzioni di supporto.
>
> Le notifiche di **errore** restano in `UserService.handleError`, come deciso nel capitolo 2: nessun effect sulle failure, altrimenti le snackbar diventano due.

### 🧑‍💻 Esercizio
In `user.reducer.spec.ts` aggiungi due test:
- `loadUser` azzera `selectedUser`: parti da uno stato con `selectedUser` valorizzato.
- `loadUserSuccess` imposta `selectedUser` e `loading: false`.

### Verifica
1. `ng build` compila.
2. Vai su `/users`, poi in DevTools fai il dispatch di `{"type": "[User] Load User", "id": <id esistente>}`. Devi vedere `Load User` → `Load User Success` e `user.selectedUser` valorizzato.
3. Fai il dispatch di `{"type": "[User] Delete User Success", "id": 999}`: compare la snackbar "User deleted". È la prova che l'effect di UI è registrato (lo store non cambia, perché l'id 999 non esiste).

### Mini-quiz
1. Cosa succede se dimentichi `dispatch: false` su `notifyAfterDelete`? *(`tap` ri-emette la stessa azione `deleteUserSuccess`, che lo store ri-dispatcha, che l'effect riceve di nuovo: loop infinito di snackbar.)*

---

<a id="modulo-k"></a>
## Modulo K – `user-list`: lettura e paginazione

File: `pages/user-list/user-list.component.ts`. Qui sostituisci `UserSignalsService` con lo store.

### Prima → dopo
| Prima | Dopo |
|---|---|
| `userSignalsService = inject(UserSignalsService)` | `private store = inject(Store)` |
| `this.userSignalsService.users()` | `this.users()` con `users = store.selectSignal(userFeature.selectUsers)` |
| `this.userSignalsService.pagination()` | `this.pagination()` con `selectSignal(userFeature.selectPagination)` |
| `loadUsersExceptCurrent(..., this.destroy$)` | `store.dispatch(UserActions.loadUsers({...}))` |
| `destroy$`, `ngOnDestroy`, `OnDestroy`, `Subject` | **rimossi** |

### Codice (solo le parti che cambiano)
```ts
import {Store} from '@ngrx/store';
import {userFeature} from '../../store/user.reducer';
import {UserActions} from '../../store/user.actions';

export class UserListComponent implements OnInit {
  // ...ViewChild, Permission, authenticationService, snackBarNotificationService invariati
  private store = inject(Store);

  private users = this.store.selectSignal(userFeature.selectUsers);
  private pagination = this.store.selectSignal(userFeature.selectPagination);
  protected loading = this.store.selectSignal(userFeature.selectLoading);

  protected datasource = computed(() => new MatTableDataSource(this.users()));

  protected pageEvent = computed(() => ({
    length: this.pagination().totalElements,
    pageSize: this.pagination().pageSize,
    pageIndex: this.pagination().pageNumber,
  }));

  // ngOnInit invariato

  getUsersExceptCurrent(page: number, size: number) {
    const currentUserId = this.authenticationService.currentUserSignal()?.id;
    this.store.dispatch(UserActions.loadUsers({
      currentUserId,
      email: this.filterEmail(),
      page,
      size,
    }));

    this.datasource().sort = this.sort;
  }

  // handleSelectedEmail, onChangePage invariati; ngOnDestroy rimosso
}
```

Nota che `datasource` e `pageEvent` **non cambiano forma**: prima dipendevano da signal di un servizio, ora da signal dello store. È il vantaggio di avere già usato i signal: il template non si tocca.

### 🐞 Nota (bug che c'era già): `sort` si perde
`this.datasource().sort = this.sort` imposta il sort sull'istanza **corrente** di `MatTableDataSource`. Quando arriva `loadUsersSuccess`, il `computed` crea una **nuova** istanza senza sort. Succedeva anche con `UserSignalsService`, perché l'HTTP è asincrono. Fix consigliato:
```ts
@ViewChild(MatSort, {static: true}) sort!: MatSort;   // la tabella non è dentro un @if: static è sicuro

protected datasource = computed(() => {
  const ds = new MatTableDataSource(this.users());
  ds.sort = this.sort;
  return ds;
});
```
e togli la riga `this.datasource().sort = this.sort`.

### Opzionale: barra di caricamento
In `imports` aggiungi `MatProgressBarModule` (`@angular/material/progress-bar`), poi nel template sopra la tabella:
```html
@if (loading()) {
  <mat-progress-bar mode="indeterminate"></mat-progress-bar>
}
```

### Verifica
1. Apri `/users`: in DevTools vedi `[User] Load Users` → `[User] Load Users Success` e la tabella si popola.
2. Cambia pagina: nuova coppia di azioni e `pagination.pageNumber` aggiornato.
3. **Prova di `switchMap`:** in Network attiva il throttling "Slow 3G" e clicca "pagina successiva" 3 volte di fila. Le prime richieste risultano *(canceled)* e in DevTools arriva **un solo** `Load Users Success`.
4. Vai sul dettaglio e torna indietro: la lista riparte dalla stessa pagina, perché la slice sopravvive alla distruzione del componente. Succedeva anche prima: `UserSignalsService` era `providedIn: 'root'`.

---

<a id="modulo-l"></a>
## Modulo L – `user-list`: eliminazione

### Codice
```ts
openDeleteUserDialog(userId: number) {
  const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
    data: {userId: userId}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result?.status === 'success') {
      this.store.dispatch(UserActions.deleteUser({id: userId}));
    }
  });
}
```
Cosa sparisce e perché:
- `this.snackBarNotificationService.notify('User deleted', ...)`: prima compariva **subito dopo la conferma, anche se la DELETE falliva**. Ora la mostra `notifyAfterDelete` solo su `deleteUserSuccess`, quindi il bug si risolve da sé.
- `snackBarNotificationService` non è più usato nel componente: rimuovi l'inject e gli import (`SnackBarNotificationService`, `NotificationTypeEnum`).
- `this.paginator.pageIndex = 0`: vedi l'esercizio sotto.

### 🧑‍💻 Esercizio (decisione di design): la paginazione dopo una delete
Dopo `deleteUserSuccess` il reducer toglie l'utente da `users`, ma `pagination.totalElements` è rimasto quello vecchio. La vecchia riga `paginator.pageIndex = 0` spostava il paginator su pagina 0 **senza ricaricare i dati**: UI e dati erano già disallineati. Scegli tu:

| Opzione | Come | Pro | Contro |
|---|---|---|---|
| **A – reducer** | In `on(deleteUserSuccess)` decrementa anche `pagination.totalElements` e resta sulla pagina corrente | Solo logica pura, testabile in una riga, nessuna richiesta HTTP | La pagina ha una riga in meno finché non cambi pagina |
| **B – effect di ricarica** | Un effect su `deleteUserSuccess` che rifà il dispatch di `loadUsers` | Il server resta la fonte di verità: la pagina si riempie | Serve salvare nello state gli ultimi parametri di ricerca (`currentUserId`, `email`, `page`, `size`), più codice |

**Raccomando A** per questo corso: è l'occasione di scrivere un altro caso di test del reducer. In entrambi i casi **togli** `this.paginator.pageIndex = 0`: il paginator è già legato a `pageEvent().pageIndex` e modificarlo a mano lo disallinea dallo store.

<details>
<summary>Soluzione A (aprila solo dopo averci provato)</summary>

```ts
on(UserActions.deleteUserSuccess, (state, {id}) => ({
  ...state,
  users: state.users.filter(u => u.id !== id),
  pagination: {...state.pagination, totalElements: state.pagination.totalElements - 1},
  loading: false,
})),
```
Test: parti da `totalElements: 5` con un utente in lista, fai il dispatch della delete e verifica `4`.
</details>

### Verifica
1. Elimina un utente: `Delete User` → `Delete User Success`, la riga sparisce, compare la snackbar e il contatore del paginator scende di 1 (con la soluzione A).
2. Con il backend spento: compare la snackbar d'errore di `UserService` (solo dopo il fix del punto 7 della revisione) e **nessuna** snackbar "User deleted".
3. Doppio click veloce su "conferma" in due dialog aperti in sequenza: grazie a `exhaustMap` in Network vedi una sola DELETE finché la prima non termina.

---

<a id="modulo-m"></a>
## Modulo M – `user-detail`

È il componente più semplice e il più istruttivo: passa da "servizio + subscribe + campo mutabile" a "dispatch + signal".

### Codice — `user-detail.component.ts`
```ts
import {Component, inject, OnInit} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {userFeature} from '../../store/user.reducer';
import {UserActions} from '../../store/user.actions';

@Component({ /* invariato */ })
export class UserDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  protected currentUser = this.store.selectSignal(userFeature.selectSelectedUser);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.store.dispatch(UserActions.loadUser({id}));
  }
}
```

### Template — `user-detail.component.html`
`currentUser` ora è `Signal<User | null>`. Avvolgi la card in un `@if` con alias, così dentro non servono `?.`:
```html
@if (currentUser(); as user) {
  <mat-card class="w-50">
    <!-- ... -->
    <strong>First Name</strong>: {{ user.firstName }}
    <!-- idem per lastName ed email -->
  </mat-card>
}
```

### Perché `snapshot` e non `paramMap.subscribe`
Il vecchio codice si iscriveva a `paramMap` ma chiamava `userDetail()` **una sola volta**, quindi in pratica usava già il valore iniziale. `snapshot` lo dice in modo esplicito e non lascia sottoscrizioni aperte (quella vecchia non veniva mai chiusa). Se un giorno navigherai da un dettaglio all'altro senza uscire dal componente, ti servirà di nuovo `paramMap` con un dispatch per ogni id: lo `switchMap` dell'effect annullerà le richieste superate.

### Verifica
1. Apri il dettaglio dell'utente A: `Load User` → `Load User Success`.
2. Torna indietro e apri l'utente B: in DevTools vedi `selectedUser` passare a `null` e poi a B. A schermo **nessun flash** dei dati di A (con Slow 3G si vede bene).
3. F5 su `/user-detail/<id>`: funziona anche con la lista vuota, e per questo abbiamo scelto `selectedUser` invece di cercare nella lista.

---

<a id="modulo-n"></a>
## Modulo N – `new-user-add`: form di creazione/modifica

Il componente fa tre cose: precompila il form in modifica, crea e aggiorna. Il **form resta locale**: lo store fornisce i dati del server, il form contiene la bozza.

### ❌ Prima un bug che c'era già: `isEditUser` è sempre `true`
```ts
currentUserId = signal<number>(0);
isEditUser = computed(() => this.currentUserId() > -1);
// su /add-user: params.get('id') === null → Number(null) === 0 → 0 > -1 → true
```
**Conseguenza:** su `/add-user` il componente crede di essere in modifica. Chiama `getUserById(0)`, mostra il bottone "Edit" e al submit fa un **update con id 0** invece di una create.
**Controllo:** apri `/add-user` e guarda il bottone. Se c'è scritto "Edit", il bug c'è.
**Fix:** `isEditUser = computed(() => this.currentUserId() > 0);`. Gli id del database partono da 1.
Con NgRx lo vedrai subito in DevTools: senza il fix, aprendo `/add-user` compare `[User] Load User` con `id: 0`.

### Codice (solo le parti che cambiano)
```ts
import {Component, computed, effect, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Store} from '@ngrx/store';
import {userFeature} from '../../store/user.reducer';
import {UserActions} from '../../store/user.actions';

export class NewUserAddComponent implements OnInit, OnDestroy {
  formBuilder = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);
  customValidators = inject(CustomValidators);
  private store = inject(Store);
  // rimossi: userService, snackBarNotificationService, router

  private user = signal<User>(new User());      // invariato: serve a reset()
  private selectedUser = this.store.selectSignal(userFeature.selectSelectedUser);
  protected loading = this.store.selectSignal(userFeature.selectLoading);

  // userForm, currentUserId, isEditUser (con il fix), roleOptions, destroy$ invariati

  constructor() {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.currentUserId.set(Number(params.get('id')));
      });

    // Signal effect di Angular (NON un effect NgRx): quando arriva l'utente dallo store, precompila il form
    effect(() => {
      const user = this.selectedUser();
      if (this.isEditUser() && user) {
        this.user.set(user);
        this.userForm.patchValue(user);
      }
    });
  }

  private setFormValuesAndValidatorsAndState() {
    this.passwordControl.clearValidators();
    this.passwordControl.updateValueAndValidity();
    this.emailControl.clearAsyncValidators();
    this.emailControl.updateValueAndValidity();

    this.store.dispatch(UserActions.loadUser({id: this.currentUserId()}));
  }

  addUser() {
    this.store.dispatch(UserActions.addUser({user: this.userForm.value}));
  }

  updateUser() {
    this.store.dispatch(UserActions.updateUser({id: this.currentUserId(), user: this.userForm.value}));
  }

  // goToUserList rimosso: la navigazione ora la fa notifyAndNavigateAfterSave
  // getter dei controlli, reset(), ngOnDestroy invariati
}
```
Rimuovi anche gli import non più usati: `UserService`, `SnackBarNotificationService`, `NotificationTypeEnum`, `HttpErrorResponse`, `Router`.

### Punti da capire
- **Due "effect" diversi, stesso nome.** `effect()` di `@angular/core` reagisce ai **signal** dentro un componente. `createEffect()` di `@ngrx/effects` reagisce alle **azioni** a livello di store. Qui usi il primo per "quando cambia `selectedUser`, aggiorna il form", cioè per sincronizzare lo stato globale con uno stato locale.
- **Perché `destroy$` resta.** Serve ancora per `paramMap`, che è routing. È sparito solo dalle chiamate HTTP. Se vuoi, sostituiscilo con `takeUntilDestroyed()` (`@angular/core/rxjs-interop`) e togli `ngOnDestroy`.
- **In caso di errore** l'effect non naviga, quindi l'utente resta sul form con i dati inseriti e vede la snackbar d'errore di `UserService`. È lo stesso comportamento di prima, ottenuto senza scriverlo.
- **Doppio submit:** l'`exhaustMap` di `addUser` ignora i submit mentre il primo è in corso. Per renderlo visibile, aggiungi `|| loading()` al `[disabled]` dei bottoni.

### Verifica
1. `/add-user` (con il fix di `isEditUser`): bottone "Add" e **nessun** `Load User` in DevTools. Salva e vedi `Add User` → `Add User Success`, poi la snackbar, il redirect a `/users` e `Load Users`.
2. `/user-edit/<id>`: `Load User` → `Load User Success`, form precompilato. Modifica e salva: `Update User` → `Update User Success`, poi snackbar e redirect.
3. Email già esistente su create (se il backend la rifiuta): `Add User Failure`, resti sul form con la snackbar d'errore.
4. Apri l'edit dell'utente A, torna indietro, apri l'edit di B: il form contiene i dati di B e **mai** quelli di A. È l'effetto del reset di `selectedUser` fatto nel Modulo J.

---

<a id="modulo-o"></a>
## Modulo O – Pulizia

1. **`UserSignalsService`**: dopo il Modulo K nessuno lo usa più (era usato solo da `user-list`). Controlla che la ricerca di `UserSignalsService` nel progetto restituisca solo il file stesso, poi cancella `services/user-signals.service.ts`. È stato il tuo "store artigianale": confrontalo un'ultima volta con `store/` prima di buttarlo.
2. **`UserService` resta**: ora lo usano gli effect (e `AuthenticationService`). È diventato un semplice *data access*: fa HTTP e basta, senza stato.
3. **`AGENTS.md`**: nella sezione *Feature-based structure* aggiungi `store/` all'elenco delle sottocartelle di feature (`pages/`, `components/`, `services/`, `models/`, `store/`), così gli agenti e i colleghi sanno dove cercare.
4. Il vecchio `pages/user-add` non è collegato a nessuna route: è preesistente e fuori da questo corso, quindi lascialo com'è.

### Verifica
- `ng build` compila senza warning di import inutilizzati.
- Tutti i test passano: `ng test`.

---

<a id="modulo-p"></a>
## Modulo P – Test di componente con `provideMockStore`

Con NgRx un componente si testa **senza HTTP e senza effect**. Si sostituisce lo store con un `MockStore` e si verificano due cose: *"il componente fa il dispatch giusto?"* e *"il componente mostra ciò che il selector restituisce?"*.

File: `pages/user-detail/user-detail.component.spec.ts`
```ts
import {TestBed} from '@angular/core/testing';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {UserDetailComponent} from './user-detail.component';
import {initialUserState, userFeature} from '../../store/user.reducer';
import {UserActions} from '../../store/user.actions';
import {User} from '../../models/user';

describe('UserDetailComponent', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserDetailComponent],
      providers: [
        provideMockStore({initialState: {user: initialUserState}}),
        {provide: ActivatedRoute, useValue: {snapshot: {paramMap: convertToParamMap({id: '7'})}}},
      ],
    });
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  afterEach(() => store.resetSelectors());

  it('fa il dispatch di loadUser con l\'id della route', () => {
    TestBed.createComponent(UserDetailComponent).detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(UserActions.loadUser({id: 7}));
  });

  it('mostra i dati di selectedUser', () => {
    store.overrideSelector(userFeature.selectSelectedUser, {id: 7, firstName: 'Mario'} as User);
    const fixture = TestBed.createComponent(UserDetailComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Mario');
  });
});
```

Punti chiave:
- `provideMockStore` **non esegue reducer né effect**: le azioni passate a `dispatch` si registrano e basta. Per questo si usa `spyOn(store, 'dispatch')`.
- `overrideSelector` forza il risultato di un selector memoizzato, e funziona anche con `selectSignal`. `resetSelectors()` in `afterEach` evita che l'override passi al test successivo.
- `ActivatedRoute` viene finto con il solo `snapshot.paramMap`, perché il componente usa solo quello.

### 🧑‍💻 Esercizio
Scrivi lo spec di `UserListComponent` con un solo test: alla creazione fa il dispatch di `UserActions.loadUsers` con `page: 0, size: 10`. Suggerimenti: fornisci un finto `AuthenticationService` (`{currentUserSignal: signal({id: 1}), userHasOneOfTheAuthorities: () => false}`), usa `provideMockStore({initialState: {user: initialUserState}})` e verifica con `jasmine.objectContaining({page: 0, size: 10})`.

Lancio: `ng test --include='**/user-detail.component.spec.ts'`.

---

<a id="fine"></a>
## Criteri di successo della Parte 2 e prossimi passi

### Checklist verificabile
1. Nessun componente della feature `user` importa `UserService` o `UserSignalsService`: la ricerca nel codice di `pages/` non trova nulla.
2. Nessun `subscribe` su chiamate HTTP nei componenti. Restano solo `afterClosed()` e `paramMap`.
3. In DevTools ogni operazione utente produce la coppia `X` → `X Success` (oppure `X Failure`), e `loading` torna sempre a `false`.
4. Snackbar di successo: una sola, e solo su successo reale. Snackbar di errore: una sola, con il messaggio del backend.
5. `ng test` è verde: reducer, selectors, effects e almeno un componente.
6. Sai spiegare perché la navigazione dopo il salvataggio sta in un effect e non nel componente.

### Prossimi passi, in ordine
1. **Modulo G (auth)**: ora che hai visto il flusso completo, porta `currentUserSignal` nello store. Le guard sono il caso più interessante, perché diventano un `select` + `filter` + `take(1)`.
2. **Estendere a `settings`** (`categories`, `vocabulary`): rifallo **da solo** senza guardare la guida, come verifica di ciò che hai imparato. È il posto giusto per provare `@ngrx/entity` (Modulo H).
3. **Riscrivere la slice `user` con `@ngrx/signals` (SignalStore)** in un branch separato e confrontare i due approcci. Righe di codice, file e leggibilità ti daranno la risposta migliore alla domanda "NgRx classico o SignalStore?".
