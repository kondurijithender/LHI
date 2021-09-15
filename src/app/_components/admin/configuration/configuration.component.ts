import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../_service/api.service';
import { AlertService } from 'src/app/_service/alert.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  DimentionEdit = false;
  industryList: any = [];
  dimentionsList: any = [];
  selectedIndex: any = null;
  constructor(private alertService: AlertService, private _api: ApiService) { }

  ngOnInit(): void {
    this.getIndustry();
    this.getDimensions();
  }

  editable(index: any): void{
    this.selectedIndex = index;
    this.DimentionEdit = true;
  }

  updateIndustry(item: any): void{
    this._api.update("industry", item, item._id).subscribe(data => {
      this.DimentionEdit = false;
      this.selectedIndex = null;
    })
  }
  updateDimention(item: any): void{
    this._api.update("dimension", item, item._id).subscribe(data => {
      this.DimentionEdit = false;
      this.selectedIndex = null;
    })
  }
  getDimensions() {
    this._api.readAll("dimension").subscribe(data => {
      this.dimentionsList = data.dimensions.sort((a: any, b: any) => a.name.localeCompare(b.name));
    })
  }
  getIndustry() {
    this._api.readAll("industry").subscribe(data => {
      this.industryList = data.industries.sort((a: any, b: any) => a.name.localeCompare(b.name));
    })
  }
  updateValue(item: any,key: any, event: any) {
    item[key] = parseInt(event.target.value);
  }
  delIndustry(id:string):void{
    if(confirm("Conform delete Industry")){
      this._api.deleteIndex("industry",id).subscribe(data=>{
        this.getIndustry();
      });
    }
  }
  delDimension(id:string):void{
    if(confirm("Conform delete Dimension")){
      this._api.deleteIndex("dimension",id).subscribe(data=>{
        this.getDimensions();
      });
    }
  }
  avgSum(item: any) {
    let v = _.omit(item, ['_id', 'companies', 'name'])
    let sumV = Object.values(v);
    return Math.ceil(_.mean(sumV));
  }

}
