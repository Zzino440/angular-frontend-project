import {Component, OnInit} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {EmployeeModel} from "../../models/employee.model";
import {EmployeeService} from "../../services/employee.service";
import {Router} from "@angular/router";
import {PreventNumbersDirective} from "../../../../shared/directives/prevent-numbers.directive";
import {CustomValidators} from "../../../../shared/validators/custom-validators";
import {JsonPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-employee-add',
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
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.scss'
})
export class EmployeeAddComponent implements OnInit {
  employee: EmployeeModel = new EmployeeModel();

  employeeForm = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required, CustomValidators.lettersOnlyValidator()]),
      lastName: new FormControl('', [Validators.required, CustomValidators.lettersOnlyValidator()]),
      emailID: new FormControl('', [Validators.required, Validators.email])
    }
  )


  constructor(private employeeService: EmployeeService, private router: Router) {
  }

  ngOnInit(): void {
  }

  addEmployee() {
    this.getFormValues()
    this.employeeService.createEmployee(this.employee).subscribe(res => {
        console.log(res);
        this.goToEmployeeList();
      }
    )
  }

  goToEmployeeList() {
    this.router.navigate(['/employees']).then();
  }

  getFormValues() {
    this.employee.firstName = this.firstNameControl?.value;
    this.employee.lastName = this.lastNameControl?.value;
    this.employee.emailID = this.emailId?.value;
    console.log('this.employeeForm.value: ', this.employeeForm.value)
    console.log('this.employee: ', this.employee)
  }

  //getters
  get firstNameControl() {
    return this.employeeForm.get(['firstName']);
  }

  get lastNameControl() {
    return this.employeeForm.get(['lastName']);
  }

  get emailId() {
    return this.employeeForm.get(['emailID']);
  }

}
