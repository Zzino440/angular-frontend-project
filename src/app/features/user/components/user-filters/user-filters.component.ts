import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule,} from "@angular/forms";
import {UserFiltersService} from "../../services/user-filters.service";
import {debounceTime, distinctUntilChanged, filter, switchMap, tap} from "rxjs";
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-user-filters',
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './user-filters.component.html',
  styleUrl: './user-filters.component.scss'
})
export class UserFiltersComponent implements OnInit {
  @Output() selectedEmail = new EventEmitter<string>();
  @Output() selectedRoles = new EventEmitter<string[]>

  //injections
  userFilterService = inject(UserFiltersService);
  userService = inject(UserService);
  userFiltersForm!: FormGroup;

  selectedFromAutocomplete = false;

  //email Filter variables
  emailFilterOptions!: string[];

  constructor() {
  }

  ngOnInit(): void {
    this.userFiltersForm = new FormGroup({
      emailFilterControl: new FormControl("", []),
      roleFilterControl: new FormControl("", [])
    })

    this.getUsersByEmail();
    this.onRoleSelection();
  }

  //method to control the autocomplete (get emails)
  getUsersByEmail() {
    this.getEmailFilterControl()?.valueChanges.pipe(
      debounceTime(500),
      filter(emailFilterValue => {
        // Se il valore proviene dall'autocomplete, salta la chiamata al servizio
        if (this.selectedFromAutocomplete) {
          this.selectedFromAutocomplete = false; // Reimposta il flag
          return false; // Salta questa iterazione
        }
        return emailFilterValue.length >= 3;
      }),
      distinctUntilChanged(),
      switchMap(emailFilterValue =>
        this.userFilterService.getUsersByEmail(emailFilterValue)
      ),
      tap(res => {
        this.emailFilterOptions = res;
      }),
    ).subscribe();
  }

  //method to control the option selected in the autocomplete
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedFromAutocomplete = true;
    const selectedValue = event.option.value;
    this.selectedEmail.emit(selectedValue);
  }

  onRoleSelection() {
    this.getRoleFilterControl()?.valueChanges.pipe().subscribe(roles => {
      this.selectedRoles.emit(roles);
      console.log('roles: ', roles)
    })

  }

  // logica per aggiornare/refreshare la tabella una volta svuotato il filtro per email
  resetFilter() {
    this.getEmailFilterControl()?.setValue("");
    this.selectedEmail.emit(this.getEmailFilterControl()?.value);
  }

  getEmailFilterControl() {
    return this.userFiltersForm.get(['emailFilterControl'])
  }

  getRoleFilterControl() {
    return this.userFiltersForm.get(['roleFilterControl'])
  }
}
