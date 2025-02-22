import { Component } from '@angular/core';
import {VocabularyListComponent} from "../../components/vocabulary-list/vocabulary-list.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    VocabularyListComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

}
