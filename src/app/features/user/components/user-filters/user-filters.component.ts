import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserFiltersService} from "../../services/user-filters.service";
import {debounceTime, distinctUntilChanged, filter, of, switchMap, tap} from "rxjs";
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

@Component({
  selector: 'app-user-filters',
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ],
  templateUrl: './user-filters.component.html',
  styleUrl: './user-filters.component.scss'
})
export class UserFiltersComponent implements OnInit {

  @Output() selectedEmail = new EventEmitter<string>();

  //injections
  userFilterService = inject(UserFiltersService);
  userFiltersForm!: FormGroup;

  //email Filter variables
  emailFilterOptions!: string[];

  constructor() {
  }

  ngOnInit(): void {
    this.userFiltersForm = new FormGroup({
      emailFilterControl: new FormControl("", [])
    })

    this.getUsersByEmail();
  }

  getUsersByEmail() {
    this.getEmailFilterControl()?.valueChanges.pipe(
      debounceTime(500),
      // Applica il filtro per valori vuoti o valori con lunghezza >= 3
      filter(emailFilterValue => emailFilterValue === '' || emailFilterValue.length >= 3),
      distinctUntilChanged(),
      switchMap(emailFilterValue =>
        this.userFilterService.getUsersByEmail(emailFilterValue)
      ),
      tap(res => {
        this.emailFilterOptions = res;
      }),
    ).subscribe();
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selectedValue = event.option.value;
    this.selectedEmail.emit(selectedValue); // Assicurati che `selectedEmail` sia di tipo `EventEmitter<string>`
  }





  getEmailFilterControl() {
    return this.userFiltersForm.get(['emailFilterControl'])
  }

}
