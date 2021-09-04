import { User } from '../../_models/user.model';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_service/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentUser: User;
  constructor(private authService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
