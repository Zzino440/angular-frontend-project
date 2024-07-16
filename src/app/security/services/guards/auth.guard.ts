import {Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../authentication.service";
import {SnackBarNotificationService} from "../../../shared/services/snack-bar-notification.service";
import {NotificationTypeEnum} from "../../../shared/enums/notification-type.enum";

/**canActivate method (guard)**/
export const authGuard: (route: any, state: any) => Promise<void> = async (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);
  const snackBarNotificationService = inject(SnackBarNotificationService);

  //call to the method in the authenticationService to know if the user is Authenticated
  try {
    const isAuthenticated = await authenticationService.isAuthenticated();
    if (!isAuthenticated) {
      await router.navigate(['/login']);
    }
  } catch (error: any) {
    authenticationService.logout();
    await router.navigate(['/login']);
    snackBarNotificationService.notify("Sessione scaduta, esegui di nuovo l'accesso", 'OK', NotificationTypeEnum.ERROR);
    console.log('Error fetching user:', error);
  }
};
