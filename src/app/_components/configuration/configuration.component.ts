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

  updateIndustry(item: any): void{
    this._api.update("industry", item, item._id).subscribe(data => {
      this.DimentionEdit = false;
    })
  }
  updateDimention(item: any): void{
    this._api.update("dimension", item, item._id).subscribe(data => {
      this.DimentionEdit = false;
    })
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
  updateValue(item: any,key: any, event: any) {
    item[key] = parseInt(event.target.value);
  }

}
