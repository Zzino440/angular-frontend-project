import {Component, computed, effect, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {PreventNumbersDirective} from "../../../../shared/directives/prevent-numbers.directive";
import {MatButton} from "@angular/material/button";
import {User} from "../../models/user";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../services/user.service";
import {Subject, takeUntil} from "rxjs";
import {Role} from "../../models/role.enum";

@Component({
  selector: 'app-new-user-add',
  standalone: true,
  imports: [
    MatCard,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    PreventNumbersDirective,
    MatButton
  ],
  templateUrl: './new-user-add.component.html',
  styleUrl: './new-user-add.component.scss'
})
export class NewUserAddComponent implements OnInit, OnDestroy {

  formBuilder = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);
  userService = inject(UserService);

  //main variables
  private user = signal<User>(new User());
  userForm = this.formBuilder.group({
    firstName: [''],
    lastName: [''],
    email: [''],
    password: [''],
    role: [''],
  })

  //utility variables
  currentUserId = signal<number>(0);
  isEditUser = computed(() => this.currentUserId() > 0);

  roleOptions = Object.values(Role);

  protected readonly destroy$ = new Subject<void>();

  constructor() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.currentUserId.set(Number(params.get('id')));
    })

    console.log('this.currentUserId(): ', this.currentUserId());
    console.log('this.isEditUser(): ', this.isEditUser());
  }


  ngOnInit(): void {

    if (this.isEditUser()) {
      this.setFormValuesAndValidatorsAndState();
    }

  }

  public submitForm() {
    console.log('this.userForm.value: ', this.userForm.value);
  }

  private setFormValuesAndValidatorsAndState() {
    this.userService.getUserById(this.currentUserId()).pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.user.set(user);
      console.log('this.user(): ', this.user());
      this.userForm.patchValue(this.user());
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
