import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginRequest} from "../../models/login-request";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {PreventNumbersDirective} from "../../../shared/directives/prevent-numbers.directive";
import {AuthenticationService} from "../../services/authentication.service";
import {Router, RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {CustomValidators} from "../../../shared/validators/custom-validators";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    PreventNumbersDirective,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatProgressSpinner,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  customValidators = inject(CustomValidators);

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
      })
  }

  get emailControl() {
    return this.loginForm.get(['email']);
  }

  get passwordControl() {
    return this.loginForm.get(['password']);
  }
}
