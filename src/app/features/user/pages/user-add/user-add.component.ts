import {Component, OnInit} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {UserModel} from "../../models/user.model";
import {UserService} from "../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PreventNumbersDirective} from "../../../../shared/directives/prevent-numbers.directive";
import {CustomValidators} from "../../../../shared/validators/custom-validators";
import {JsonPipe, NgIf} from "@angular/common";

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
  ],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.scss'
})
export class UserAddComponent implements OnInit {
  //main variables
  user: UserModel = new UserModel();
  userForm!: FormGroup;

  //utility variables
  currentUserId!: number;
  editUser!: boolean;


  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {
    //get id from the route
    this.route.paramMap.subscribe(params => {
      this.currentUserId = Number(params.get('id'));
    });

    this.editUser = !!this.currentUserId;
  }

  ngOnInit(): void {
    this.userForm = new FormGroup(
      {
        firstName: new FormControl('', [Validators.required, CustomValidators.lettersOnlyValidator()]),
        lastName: new FormControl('', [Validators.required, CustomValidators.lettersOnlyValidator()]),
        email: new FormControl('', [Validators.required, Validators.email])
      }
    )
    this.setFormValues();
  }

  submitForm() {
    this.getFormValues();
    this.editUser ? this.updateUser() : this.addUser();
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
    this.user.firstName = this.firstNameControl?.value;
    this.user.lastName = this.lastNameControl?.value;
    this.user.email = this.email?.value;
  }

  setFormValues() {
    if (this.editUser) {
      this.userService.getUserById(this.currentUserId).subscribe(res => {
        this.user = res;
        this.firstNameControl?.setValue(this.user.firstName);
        this.lastNameControl?.setValue(this.user.lastName);
        this.email?.setValue(this.user.email);
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

  get email() {
    return this.userForm.get(['email']);
  }

}
