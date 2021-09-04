import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../_service/api.service"
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private _api: ApiService, private route: Router) {}

  ngOnInit(): void {
    
  }}
