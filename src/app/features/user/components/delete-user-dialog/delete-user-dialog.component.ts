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
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-delete-user-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogClose,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatDialogContainer
  ],
  templateUrl: './delete-user-dialog.component.html',
  styleUrl: './delete-user-dialog.component.scss'
})
export class DeleteUserDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService, public dialogRef: MatDialogRef<DeleteUserDialogComponent>) {
  }

  ngOnInit() {

  }

  deleteUser() {
    this.userService.deleteUser(this.data.userId).subscribe(res => {
      console.log('res delete user', res);
      this.dialogRef.close({ status: 'success', message: 'User successfully deleted' });
    });
  }

  closeDialog() {
    this.dialogRef.close({ status: 'cancelled', message: 'User deletion cancelled' });
  }

}
