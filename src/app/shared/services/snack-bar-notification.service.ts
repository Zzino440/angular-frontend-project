import {inject, Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {CustomSnackbarComponent} from "../components/custom-snackbar/custom-snackbar.component";
import {NotificationTypeEnum} from "../enums/notification-type.enum";

@Injectable({
  providedIn: 'root'
})
export class SnackBarNotificationService {

  //injections
  snackBar = inject(MatSnackBar);

  //variables
  durationInSeconds: number = 10;

  constructor() {
  }

  notify(message: string, action?: string, type?: NotificationTypeEnum) {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        message: message || 'ERROR',
        action: action,
        type: type
      },
      duration: this.durationInSeconds * 1000,
      direction:'ltr',
      horizontalPosition:'center',
    })
  }
}
