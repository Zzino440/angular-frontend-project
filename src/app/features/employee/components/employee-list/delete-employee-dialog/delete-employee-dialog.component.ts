import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContainer,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";

@Component({
  selector: 'app-delete-employee-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogClose,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatDialogContainer
  ],
  templateUrl: './delete-employee-dialog.component.html',
  styleUrl: './delete-employee-dialog.component.scss'
})
export class DeleteEmployeeDialogComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {

  }

}
