import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
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
    return this.httpClient.get<EmployeeModel[]>(`${this.environment}employees`).pipe(
      catchError(this.handleError)
    );
  }

  createEmployee(employee: EmployeeModel): Observable<Object> {
    return this.httpClient.post(`${this.environment}employees`, employee).pipe(
      catchError(this.handleError)
    );
  }

  getEmployeeById(id: number): Observable<EmployeeModel> {
    return this.httpClient.get<EmployeeModel>(`${this.environment}employees/${id}`).pipe(
      catchError(this.handleError)
    )
  }


  private handleError(error: HttpErrorResponse) {
    // Logica per gestire l'errore
    console.error('Si è verificato un errore:', error.error);

    // Restituire un Observable che emette l'errore
    return throwError(() => error);
  }
}
