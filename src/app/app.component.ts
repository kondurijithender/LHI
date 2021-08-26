import { Router } from '@angular/router';
import { AuthenticationService } from './_service/authentication.service';
import { Component, OnInit } from '@angular/core';

import { User } from './_models/user.model';
import { ApiService } from './_service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  currentUser: User;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
  ) {
  }
  ngOnInit() {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
    if(this.currentUser.accessToken) {
   //   this.router.navigate(['/home']);
    }
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
}
isEmptyObject(obj: any) {
  return (obj && (Object.keys(obj).length === 0));
}
}
