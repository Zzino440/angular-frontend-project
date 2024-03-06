import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../authentication.service";
import {UserService} from "../../../features/user/services/user.service";
import {lastValueFrom} from "rxjs";

/**canActivate method (guard)**/
export const authGuard: CanActivateFn = async (route, state) => {
  //injections
  const authenticationService = inject(AuthenticationService);

  //call to the method in the authenticationService to know if the user is Authenticated
  return authenticationService.isAuthenticated();

};
