import {Actions, createEffect, ofType} from "@ngrx/effects";
import {inject} from "@angular/core";
import {UserService} from "../services/user.service";
import {UserActions} from "./user.actions";
import {catchError, concatMap, exhaustMap, map, of, switchMap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";


export const loadUsers = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) =>
    actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(({currentUserId, email, page, size}) =>
        userService.getUserListExceptCurrent(currentUserId, email, page, size).pipe(
          map(response => UserActions.loadUsersSuccess({response})),
          catchError((error: HttpErrorResponse) =>
            of(UserActions.loadUsersFailure({error: String(error.error)})),
          )
        )
      )
    ),
  {functional: true}
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
          )
        )
      )
    ),
  {functional: true}
);

export const addUser = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) =>
    actions$.pipe(
      ofType(UserActions.addUser),
      exhaustMap(({user}) =>
        userService.createUser(user).pipe(
          map(user => UserActions.addUserSuccess({user})),
          catchError((error: HttpErrorResponse) =>
            of(UserActions.addUserFailure({error: String(error.error)})),
          )
        )
      )
    ),
  {functional: true}
)

export const updateUser = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) =>
    actions$.pipe(
      ofType(UserActions.updateUser),
      concatMap(({id, user}) =>
        userService.updateUser(id, user).pipe(
          map(user => UserActions.updateUserSuccess({user})),
          catchError((error: HttpErrorResponse) =>
            of(UserActions.updateUserFailure({error: String(error.error)})),
          )
        )
      )
    ),
  {functional: true}
);

