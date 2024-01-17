import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginRequest} from "../../models/login-request";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {PreventNumbersDirective} from "../../../shared/directives/prevent-numbers.directive";
import {AuthenticationService} from "../../services/authentication.service";

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

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    })
  }

  submitLoginForm() {
    this.userToLogin = this.loginForm.getRawValue();
    this.authenticationService.authenticate(this.userToLogin).subscribe(res => {
      console.log('res.token: ',res.token)
    })

  }


  get email() {
    return this.loginForm.get(['email']);
  }

  get password() {
    return this.loginForm.get(['password']);
  }
}
