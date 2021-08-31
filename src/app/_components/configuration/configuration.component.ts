import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../_service/api.service';
import { AlertService } from 'src/app/_service/alert.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  DimentionEdit = false;
  industryList: any = [];
  dimentionsList: any = [];
  constructor(private alertService: AlertService, private _api: ApiService) { }

  ngOnInit(): void {
    this.getIndustry();
    this.getDimensions();
  }

  editable(): void{
    this.DimentionEdit = true;
  }

  update(item: any): void{
    console.log(item);
    this.DimentionEdit = false;
  }
  getDimensions() {
    this._api.readAll("dimension").subscribe(data => {
      this.dimentionsList = data.dimensions;
    })
  }
  getIndustry() {
    this._api.readAll("industry").subscribe(data => {
      this.industryList = data.industries;
    })
  }
  updateValue(item: any, event: any) {
    console.log(item);
    console.log(event.value);
  }

}
