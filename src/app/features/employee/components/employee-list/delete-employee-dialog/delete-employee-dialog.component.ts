import {Component, Inject, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContainer,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {EmployeeService} from "../../../services/employee.service";

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
  closeDialog!: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private employeeService: EmployeeService, public dialogRef: MatDialogRef<DeleteEmployeeDialogComponent>) {
  }

  ngOnInit() {

  }

  deleteEmployee() {
    this.employeeService.deleteEmployee(this.data.employeeId).subscribe(res => {
      this.dialogRef.close();
      console.log('res delete employee', res)
    })

  }

}
