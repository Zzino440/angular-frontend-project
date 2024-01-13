import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {EmployeeModel} from "../models/employee.model";
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private environment = environment.endpointUri

  constructor(private httpClient: HttpClient) {
  }

  getEmployeeList(): Observable<EmployeeModel[]> {
    return this.httpClient.get<EmployeeModel[]>(`${this.environment}employees`)
  }

  createEmployee(employee: EmployeeModel): Observable<Object> {
    return this.httpClient.post(`${this.environment}employees`, employee)
  }
}
