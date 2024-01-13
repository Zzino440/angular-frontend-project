import {Component, OnInit} from '@angular/core';
import {EmployeeService} from "../../services/employee.service";
import {EmployeeModel} from "../../models/employee.model";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    MatTableModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {

  employeeList!: EmployeeModel[];


  displayedColumns: string[] = ['firstName','lastName','emailID']

  datasource: MatTableDataSource<EmployeeModel> = new MatTableDataSource<EmployeeModel>();

  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit(): void {
    this.getEmployees()
  }

  getEmployees() {
    this.employeeService.getEmployeeList().subscribe(res => {
      this.employeeList = res;
      this.datasource.data = res;
      console.log('data: ', this.datasource.data)
    })

  }

}
