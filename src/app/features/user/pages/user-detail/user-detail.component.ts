import {Component, OnInit} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../models/user";
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

  currentUser: User = new User();
  currentUserId!: number;

  constructor(private route: ActivatedRoute, private userService: UserService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.currentUserId = Number(params.get('id'));
    });

    this.userDetail()
  }

  userDetail() {
    this.userService.getUserById(this.currentUserId).subscribe((res) => {
      this.currentUser = res;
    })
  }

}
