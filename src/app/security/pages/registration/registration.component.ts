import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomValidators} from "../../../shared/validators/custom-validators";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {PreventNumbersDirective} from "../../../shared/directives/prevent-numbers.directive";
import {AuthenticationService} from "../../services/authentication.service";
import {RegisterRequest} from "../../models/register-request";
import {AuthResponse} from "../../models/auth-response";

@Component({
  selector: 'app-registration',
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
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit {

  registrationForm!: FormGroup;
  userToRegister!: RegisterRequest;
  authResponse!: AuthResponse;

  constructor(private authenticationService: AuthenticationService) {

  }


  ngOnInit(): void {
    this.registrationForm = new FormGroup(
      {
        firstName: new FormControl('', [Validators.required, CustomValidators.lettersOnlyValidator()]),
        lastName: new FormControl('', [Validators.required, CustomValidators.lettersOnlyValidator()]),
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
      }
    )
  }

  submitRegistrationForm() {
    this.userToRegister = this.registrationForm.getRawValue();
    this.authenticationService.registration(this.userToRegister).subscribe(res => {
      localStorage.setItem('token', res.token);
      this.authenticationService.currentUserSignal.set(res)
      console.log('this.authenticationService.currentUserSignal: ',this.authenticationService.currentUserSignal)
    })
  }


  get firstNameControl() {
    return this.registrationForm.get(['firstName']);
  }

  get lastNameControl() {
    return this.registrationForm.get(['lastName']);
  }

  get email() {
    return this.registrationForm.get(['email']);
  }

  get password() {
    return this.registrationForm.get(['password']);
  }


}
