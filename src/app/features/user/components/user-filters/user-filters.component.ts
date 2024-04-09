import {Component, EventEmitter, inject, OnInit, Output, ViewChild} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule,} from "@angular/forms";
import {UserFiltersService} from "../../services/user-filters.service";
import {debounceTime, distinctUntilChanged, filter, switchMap, tap} from "rxjs";
import {MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {CustomValidators} from "../../../../shared/validators/custom-validators";

@Component({
  selector: 'app-user-filters',
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './user-filters.component.html',
  styleUrl: './user-filters.component.scss'
})
export class UserFiltersComponent implements OnInit {
  @ViewChild('userEmailAutoComplelete') userEmailFilterAutocomplete!: MatAutocomplete;
  @Output() selectedEmail = new EventEmitter<string>();

  //injections
  userFilterService = inject(UserFiltersService);
  customValidators = inject(CustomValidators);


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
    this.emailFilterControl?.valueChanges.pipe(
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
        this.emailFilterControl?.addAsyncValidators([this.customValidators.emailNoExistsValidator()])
        console.log('this.emailFilterControl?.validator: ', this.emailFilterControl?.validator)
      }),
    ).subscribe();
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedFromAutocomplete = true;
    const selectedValue = event.option.value;
    this.selectedEmail.emit(selectedValue);
  }

  // logica per aggiornare/refreshare la tabella una volta svuotato il filtro per email
  resetFilter() {
    this.emailFilterControl?.setValue("");
    this.selectedEmail.emit(this.emailFilterControl?.value);
    this.selectedFromAutocomplete = true;
  }

  get emailFilterControl() {
    return this.userFiltersForm.get(['emailFilterControl'])
  }

}
