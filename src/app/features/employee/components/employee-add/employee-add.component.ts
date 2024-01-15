import {Component, OnInit} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {EmployeeModel} from "../../models/employee.model";
import {EmployeeService} from "../../services/employee.service";
import {ActivatedRoute, Router} from "@angular/router";
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
  //main variables
  employee: EmployeeModel = new EmployeeModel();
  employeeForm!: FormGroup;

  //utility variables
  currentEmployeeId!: number;
  editEmployee!: boolean;


  constructor(private employeeService: EmployeeService, private router: Router, private route: ActivatedRoute) {
    //get id from the route
    this.route.paramMap.subscribe(params => {
      this.currentEmployeeId = Number(params.get('id'));
    });

    this.editEmployee = !!this.currentEmployeeId;
  }

  ngOnInit(): void {
    this.employeeForm = new FormGroup(
      {
        firstName: new FormControl('', [Validators.required, CustomValidators.lettersOnlyValidator()]),
        lastName: new FormControl('', [Validators.required, CustomValidators.lettersOnlyValidator()]),
        emailID: new FormControl('', [Validators.required, Validators.email])
      }
    )
    this.setFormValues();
  }

  submitForm() {
    this.getFormValues();
    this.editEmployee ? this.updateEmployee() : this.addEmployee();
  }

  addEmployee() {
    this.employeeService.createEmployee(this.employee).subscribe(res => {
        console.log('res save', res)
        this.goToEmployeeList();
      }
    )
  }

  updateEmployee() {
    this.employeeService.updateEmployee(this.currentEmployeeId, this.employee).subscribe(res => {
      console.log('res update', res)
      this.goToEmployeeList();
    })
  }

  // form get and set
  getFormValues() {
    this.employee.firstName = this.firstNameControl?.value;
    this.employee.lastName = this.lastNameControl?.value;
    this.employee.emailID = this.emailId?.value;
  }

  setFormValues() {
    if (this.editEmployee) {
      this.employeeService.getEmployeeById(this.currentEmployeeId).subscribe(res => {
        this.employee = res;
        this.firstNameControl?.setValue(this.employee.firstName);
        this.lastNameControl?.setValue(this.employee.lastName);
        this.emailId?.setValue(this.employee.emailID);
      })
    }
  }

  goToEmployeeList() {
    this.router.navigate(['/employees']).then();
  }

  //getters form values
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
