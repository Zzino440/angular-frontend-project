import { Component } from '@angular/core';
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    MatCardModule
  ],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent {

}
