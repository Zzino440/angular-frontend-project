import {Component, Inject, inject, OnInit} from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarActions, MatSnackBarContainer,
  MatSnackBarLabel,
  MatSnackBarRef
} from "@angular/material/snack-bar";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {NgClass, NgSwitch, NgSwitchCase} from "@angular/common";
import {NotificationTypeEnum} from "../../enums/notification-type.enum";

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [
    MatSnackBarActions,
    MatButton,
    MatSnackBarAction,
    MatSnackBarLabel,
    MatSnackBarContainer,
    MatIconButton,
    MatIcon,
    NgClass,
    NgSwitch,
    NgSwitchCase
  ],
  template: `
    <div class="container snack-bar-container">
      <div class="row d-flex align-items-center">
        <div class="col-md-1">
          <button class="pe-none" role="button" mat-icon-button>
            <mat-icon
              [ngClass]="{
              'success-icon':data.type === NotificationTypeEnum.SUCCESS,
              'error-icon': data.type == NotificationTypeEnum.ERROR,
              'info-icon': data.type == NotificationTypeEnum.INFO,
              'warning-icon': data.type == NotificationTypeEnum.WARNING}">
              @if (data.type === NotificationTypeEnum.SUCCESS) {
                check_circle
              } @else if (data.type === NotificationTypeEnum.ERROR) {
                error
              } @else if (data.type === NotificationTypeEnum.INFO) {
                info
              } @else if (data.type === NotificationTypeEnum.WARNING) {
                warning
              }
            </mat-icon>
          </button>
        </div>
        <div class="col-md-9 d-flex justify-content-center align-items-center">
          <div class="snack-bar-message fw-bold text-uppercase" matSnackBarLabel>
            {{ data.message }}
          </div>
        </div>
        <div class="col-md-2 d-flex justify-content-center align-items-center text-white" matSnackBarActions>
          <button mat-button class="text-white" (click)="snackBarRef.dismissWithAction()"
                  matSnackBarAction>{{ data.action }}
          </button>
        </div>
      </div>
    </div>

  `,
  styles: `
    @import "../../../../assets/style/colors";

    .success-icon {
      color: $success-color;
    }

    .error-icon {
      color: $error-color
    }

    .info-icon {
      color: $info-color;
    }

    .warning-icon {
      color: $warn-color;
    }
  `
})
export class CustomSnackbarComponent implements OnInit {

  protected readonly NotificationTypeEnum = NotificationTypeEnum;

  snackBarRef = inject(MatSnackBarRef);


  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: {
    message: string,
    action: string,
    type: string
  }) {
  }

  ngOnInit() {}
}
