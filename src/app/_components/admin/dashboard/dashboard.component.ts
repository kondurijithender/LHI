import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../_service/api.service';
import { Router } from '@angular/router';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public permissions: any;
  constructor(private _api: ApiService, private route: Router) {}

  ngOnInit(): void {
    this.getPermissions();
  }
  getPermissions() {
    this._api.readAll('permissions').subscribe((data) => {
      this.permissions = data.permissions;
      console.log(this.permissions);
    });
  }
  selectCountry(event: any, index: number) {
    const obj = {
      screen: index,
      value: event.target.value,
      selected: event.target.checked
    }
    this._api.create("update-permission", obj).subscribe(data => {

    })
  }

}
