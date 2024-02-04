import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../authentication.service";
import {UserService} from "../../../features/user/services/user.service";
import {lastValueFrom} from "rxjs";

/**canActivate method (guard)**/
export const authGuard: CanActivateFn = async (route, state) => {
  //injections
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);
  const userService = inject(UserService);

  const loggedUserId = Number(localStorage.getItem('userId'));
  try {
    const user = await lastValueFrom(userService.getUserById(loggedUserId));
    authenticationService.currentUserSignal.set(user);
  } catch (error) {
    authenticationService.logout()
    localStorage.clear();
    console.log('Error fetching user:', error);
  }

  const isAuthenticated = authenticationService.isLoggedIn();

  if (isAuthenticated) {
    return true;
  } else {
    await router.navigate(['/login']);
    return false;
  }

};
