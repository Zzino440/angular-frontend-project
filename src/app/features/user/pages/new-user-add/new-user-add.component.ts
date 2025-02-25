import {Component, computed, effect, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {PreventNumbersDirective} from "../../../../shared/directives/prevent-numbers.directive";
import {MatButton} from "@angular/material/button";
import {User} from "../../models/user";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../services/user.service";
import {Subject, takeUntil} from "rxjs";
import {Role} from "../../models/role.enum";
import {MatOption, MatSelect} from "@angular/material/select";
import {CustomValidators} from "../../../../shared/validators/custom-validators";

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
        MatButton,
        MatSelect,
        MatOption,
        MatError
    ],
    templateUrl: './new-user-add.component.html',
    styleUrl: './new-user-add.component.scss'
})
export class NewUserAddComponent implements OnInit, OnDestroy {

    formBuilder = inject(FormBuilder);
    activatedRoute = inject(ActivatedRoute);
    userService = inject(UserService);
    private customValidators = inject(CustomValidators);

    //main variables
    private user = signal<User>(new User());

    userForm = this.formBuilder.nonNullable.group({
        firstName: new FormControl({value: '', disabled: false}, {
            validators: [Validators.required, this.customValidators.lettersOnlyValidator],
            nonNullable: true
        }),
        lastName: new FormControl({value: '', disabled: false}, {
            validators: [Validators.required, this.customValidators.lettersOnlyValidator],
            nonNullable: true
        }),
        email: new FormControl({value: '', disabled: false}, {
            validators: [Validators.required, Validators.email],
            asyncValidators: [this.customValidators.emailExistsValidator()],
            updateOn: 'blur',
            nonNullable: true
        }),
        password: new FormControl({value: '', disabled: false}, {
            validators: [Validators.required],
            nonNullable: true
        }),
        role: new FormControl({value: '', disabled: false}, {
            validators: [Validators.required],
            nonNullable: true
        })
    });

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

    get firstNameControl() {
        return this.userForm.controls.firstName;
    }

    get lastNameControl() {
        return this.userForm.controls.lastName;
    }

    get emailControl() {
        return this.userForm.controls.email;
    }

    get passwordControl() {
        return this.userForm.controls.password;
    }

    get roleControl() {
        return this.userForm.controls.role;
    }


    reset() {
        this.userForm.reset(this.user());
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
