import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appPreventNumbers]',
  standalone: true
})
export class PreventNumbersDirective {
  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (event.key >= '0' && event.key <= '9') {
      event.preventDefault();
    }
  }
}
