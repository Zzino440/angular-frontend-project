import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomValidators} from "../../../shared/validators/custom-validators";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {PreventNumbersDirective} from "../../../shared/directives/prevent-numbers.directive";
import {AuthenticationService} from "../../services/authentication.service";
import {RegisterRequest} from "../../models/register-request";
import {Router, RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";

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
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit {
  customValidators = inject(CustomValidators);

  registrationForm!: FormGroup;
  userToRegister!: RegisterRequest;

  hide = true;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {

  }


  ngOnInit(): void {
    this.registrationForm = new FormGroup(
      {
        firstName: new FormControl('', [Validators.required, this.customValidators.lettersOnlyValidator()]),
        lastName: new FormControl('', [Validators.required, this.customValidators.lettersOnlyValidator()]),
        email: new FormControl('', {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.customValidators.emailExistsValidator()],
          updateOn: 'blur', // o 'change', a seconda di quando vuoi che il validator venga attivato
        }),
        password: new FormControl('', [Validators.required]),
      }
    )
  }

  submitRegistrationForm() {
    this.userToRegister = this.registrationForm.getRawValue();
    this.authenticationService.registration(this.userToRegister).subscribe(res => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('userId', String(res.id));
      this.authenticationService.currentUserSignal.set(res);
      this.router.navigate(['/users']).then();
    })
  }


  get firstNameControl() {
    return this.registrationForm.get(['firstName']);
  }

  get lastNameControl() {
    return this.registrationForm.get(['lastName']);
  }

  get emailControl() {
    return this.registrationForm.get(['email']);
  }

  get passwordControl() {
    return this.registrationForm.get(['password']);
  }


}
