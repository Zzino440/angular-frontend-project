import {Component, OnInit} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {EmployeeModel} from "../../models/employee.model";
import {EmployeeService} from "../../services/employee.service";
import {Router} from "@angular/router";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.scss'
})
export class EmployeeAddComponent implements OnInit {

  employee: EmployeeModel = new EmployeeModel();

  employeeForm = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl(''),
      emailID: new FormControl('')
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
      }, error => console.log(error)
    )
  }

  goToEmployeeList() {
    this.router.navigate(['/employees']);
  }

  getFormValues() {
    this.employee.firstName = this.employeeForm.get(['firstName'])?.value;
    this.employee.lastName = this.employeeForm.get(['lastName'])?.value;
    this.employee.emailID = this.employeeForm.get(['emailID'])?.value;
    console.log('this.employeeForm.value: ',this.employeeForm.value)
    console.log('this.employee: ', this.employee)

  }


}
