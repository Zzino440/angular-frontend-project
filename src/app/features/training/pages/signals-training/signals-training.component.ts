import {Component, OnInit, signal} from '@angular/core';

@Component({
  selector: 'app-signals-training',
  standalone: true,
  imports: [],
  templateUrl: './signals-training.component.html',
  styleUrl: './signals-training.component.scss'
})
export class SignalsTrainingComponent implements OnInit {


  constructor() {
  }

  ngOnInit(): void {
/*    this.firstExample();*/
  }




  private firstExample() {
    const count = signal(0);
    console.log(count());
    count.set(1);
    console.log(count());
    count.update(value => value + 1);
    console.log(count());
  }

}
