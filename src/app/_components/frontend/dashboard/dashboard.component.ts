import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../_service/api.service"
import { Router } from '@angular/router';

@Component({
  selector: 'frontend-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class FrontEndDashboardComponent implements OnInit {

  constructor(private _api: ApiService, private route: Router) {}

  ngOnInit(): void {
    
  }

  validateForm(): void{
    this.route.navigate(["/questionnaires"]);
  }
}
