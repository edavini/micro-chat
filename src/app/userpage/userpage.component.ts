import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.css']
})
export class UserpageComponent implements OnInit {

  loginUser: {
    email: string,
    password: string
  }

  constructor(public auth: AuthServiceService) { }

  ngOnInit(): void {
    this.loginUser = {
      email: '',
      password: ''
    }
  }

  loginWithEmailAndPassword(): void {
    this.auth.login(this.loginUser.email, this.loginUser.password)
  }

}
