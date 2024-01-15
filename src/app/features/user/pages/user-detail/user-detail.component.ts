import {Component, OnInit} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {ActivatedRoute} from "@angular/router";
import {UserModel} from "../../models/user.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    MatCardModule
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {

  currentUser: UserModel = new UserModel();
  currentUserId!: number;

  constructor(private route: ActivatedRoute, private employeeService: UserService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.currentUserId = Number(params.get('id'));
    });

    this.employeeDetail()
  }

  employeeDetail() {
    this.employeeService.getUserById(this.currentUserId).subscribe((res) => {
      this.currentUser = res;
    })
  }

}
