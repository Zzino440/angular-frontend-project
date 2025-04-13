import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginRequest} from "../../models/login-request";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {AuthenticationService} from "../../services/authentication.service";
import {Router, RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {CustomValidators} from "../../../shared/validators/custom-validators";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {SnackBarNotificationService} from "../../../shared/services/snack-bar-notification.service";
import {NotificationTypeEnum} from "../../../shared/enums/notification-type.enum";

@Component({
    selector: 'app-login',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatProgressSpinner
  ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  customValidators = inject(CustomValidators);
  snackBarNotificationService = inject(SnackBarNotificationService);

  loginForm!: FormGroup;
  userToLogin!: LoginRequest;

  hide = true;

  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.customValidators.emailNoExistsValidator()],
        updateOn: 'change',
      }),
      password: new FormControl('', [Validators.required]),
    })
  }

  submitLoginForm() {
    this.userToLogin = this.loginForm.getRawValue();
    this.authenticationService.authenticate(this.userToLogin)
      .subscribe(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', String(res.id));
        this.authenticationService.currentUserSignal.set(res);
        console.log(this.authenticationService.currentUserSignal()?.token)
        this.router.navigate(['/users']).then();
        this.snackBarNotificationService.notify('Logged in succesfully', 'OK', NotificationTypeEnum.SUCCESS);
      })
  }

  get emailControl() {
    return this.loginForm.get(['email']);
  }

  get passwordControl() {
    return this.loginForm.get(['password']);
  }
}
