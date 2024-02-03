import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule,} from "@angular/forms";
import {UserFiltersService} from "../../services/user-filters.service";
import {debounceTime, distinctUntilChanged, filter, switchMap, tap} from "rxjs";
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

  selectedFromAutocomplete = false;

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
      filter(emailFilterValue => {
        // Se il valore proviene dall'autocomplete, salta la chiamata al servizio
        if (this.selectedFromAutocomplete) {
          this.selectedFromAutocomplete = false; // Reimposta il flag
          return false; // Salta questa iterazione
        }
        return emailFilterValue === '' || emailFilterValue.length >= 3;
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


  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedFromAutocomplete = true;
    // Ora puoi anche emettere il valore selezionato qui, se necessario
    const selectedValue = event.option.value;
    this.selectedEmail.emit(selectedValue);
  }





  getEmailFilterControl() {
    return this.userFiltersForm.get(['emailFilterControl'])
  }

}
