import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../_service/api.service';
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

}
