import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginRequest} from "../../models/login-request";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {PreventNumbersDirective} from "../../../shared/directives/prevent-numbers.directive";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";

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
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  userToLogin!: LoginRequest;

  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
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
        console.log('this.authenticationService.currentUserSignal() === null: ', this.authenticationService.currentUserSignal() === null)
        this.router.navigate(['/users']).then();
      })
  }

  get email() {
    return this.loginForm.get(['email']);
  }

  get password() {
    return this.loginForm.get(['password']);
  }
}
