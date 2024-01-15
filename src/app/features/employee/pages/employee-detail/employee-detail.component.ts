import {Component, OnInit} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {ActivatedRoute} from "@angular/router";
import {EmployeeModel} from "../../models/employee.model";
import {EmployeeService} from "../../services/employee.service";

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    MatCardModule
  ],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent implements OnInit {

  currentEmployee: EmployeeModel = new EmployeeModel();
  currentEmployeeId!: number;

  constructor(private route: ActivatedRoute, private employeeService: EmployeeService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.currentEmployeeId = Number(params.get('id'));
    });

    this.employeeDetail()
  }

  employeeDetail() {
    this.employeeService.getEmployeeById(this.currentEmployeeId).subscribe((res) => {
      this.currentEmployee = res;
    })
  }

}
