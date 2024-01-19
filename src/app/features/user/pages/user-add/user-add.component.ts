import {Component, OnInit} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PreventNumbersDirective} from "../../../../shared/directives/prevent-numbers.directive";
import {CustomValidators} from "../../../../shared/validators/custom-validators";
import {JsonPipe, NgIf} from "@angular/common";
import {MatSelectModule} from "@angular/material/select";
import {Role} from "../../models/role.enum";

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    PreventNumbersDirective,
    NgIf,
    JsonPipe,
    MatSelectModule,
  ],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.scss'
})
export class UserAddComponent implements OnInit {
  //main variables
  user: User = new User();
  userForm!: FormGroup;

  //utility variables
  currentUserId!: number;
  isEditUser!: boolean;

  roleOptions = Object.values(Role);


  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {
    //get id from the route
    this.route.paramMap.subscribe(params => {
      this.currentUserId = Number(params.get('id'));
    });

    this.isEditUser = !!this.currentUserId;
  }

  ngOnInit(): void {
    this.userForm = new FormGroup(
      {
        firstName: new FormControl('', [Validators.required, CustomValidators.lettersOnlyValidator()]),
        lastName: new FormControl('', [Validators.required, CustomValidators.lettersOnlyValidator()]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
        role: new FormControl('', [Validators.required])
      }
    )
    this.setFormValues();
  }

  submitForm() {
    this.getFormValues();
    this.isEditUser ? this.updateUser() : this.addUser();
  }

  addUser() {
    this.userService.createUser(this.user).subscribe(res => {
        console.log('res save', res)
        this.goToUserList();
      }
    )
  }

  updateUser() {
    this.userService.updateUser(this.currentUserId, this.user).subscribe(res => {
      console.log('res update', res)
      this.goToUserList();
    })
  }

  // form get and set
  getFormValues() {
    console.log('this.userForm.value: ', this.userForm.value);
    this.user.firstName = this.firstNameControl?.value;
    this.user.lastName = this.lastNameControl?.value;
    this.user.email = this.emailControl?.value;
    this.user.password = this.passwordControl?.value;
    this.user.role = this.roleControl?.value;
  }

  setFormValues() {
    if (this.isEditUser) {
      this.passwordControl?.clearValidators();
      this.passwordControl?.updateValueAndValidity();

      this.userService.getUserById(this.currentUserId).subscribe(res => {
        this.user = res;
        console.log('res: ',res)
        /*this.userForm.setValue(this.user);*/
        this.firstNameControl?.setValue(this.user.firstName);
        this.lastNameControl?.setValue(this.user.lastName);
        this.emailControl?.setValue(this.user.email);
        this.roleControl?.setValue(this.user.role);
        this.userForm.markAllAsTouched();
      })
    }
  }

  goToUserList() {
    this.router.navigate(['/users']).then();
  }

  //getters form values
  get firstNameControl() {
    return this.userForm.get(['firstName']);
  }

  get lastNameControl() {
    return this.userForm.get(['lastName']);
  }

  get emailControl() {
    return this.userForm.get(['email']);
  }

  get passwordControl() {
    return this.userForm.get(['password']);
  }

  get roleControl() {
    return this.userForm.get(['role']);
  }

}
