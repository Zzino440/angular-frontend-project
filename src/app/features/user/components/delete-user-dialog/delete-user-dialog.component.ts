import  {Component, Inject} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";

@Component({
    selector: 'app-delete-user-dialog',
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ],
    templateUrl: './delete-user-dialog.component.html',
    styleUrl: './delete-user-dialog.component.scss'
})
export class DeleteUserDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { userId:number },
              public dialogRef: MatDialogRef<DeleteUserDialogComponent>) {
  }

  confirmDelete() {
    this.dialogRef.close({ status: 'success', message: 'User deletion confirmed' });
  }

  closeDialog() {
    this.dialogRef.close({ status: 'cancelled', message: 'User deletion cancelled' });
  }

}
