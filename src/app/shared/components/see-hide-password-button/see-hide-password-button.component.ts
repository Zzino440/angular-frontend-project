import {Component, EventEmitter, Output} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-see-hide-password-button',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatInputModule
  ],
  template: `
    <div>
      <button mat-icon-button type="button" (click)="toggleVisibility()" [attr.aria-label]="'Hide password'"
              [attr.aria-pressed]="hide">
        <mat-icon matSuffix>{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
      </button>
    </div>
  `,
  styles: ``
})
export class SeeHidePasswordButtonComponent {

  hide = true;

  @Output() visibilityToggle = new EventEmitter<boolean>();

  constructor() {
  }

  toggleVisibility(): void {
    this.hide = !this.hide;
    this.visibilityToggle.emit(this.hide);
  }

}
