import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {EmployeeModel} from "../models/employee.model";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseURL: string = "http://localhost:8080/api/v1/"

  constructor(private httpClient: HttpClient) {

  }

  getEmployeeList(): Observable<EmployeeModel[]> {
    return this.httpClient.get<EmployeeModel[]>(`${this.baseURL}employees`)
  }

  createEmployee(employee: EmployeeModel): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}employees`, employee)

  }
}
