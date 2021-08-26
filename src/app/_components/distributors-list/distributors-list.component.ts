import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/_service/alert.service';
import { BrandService, BrandsType } from 'src/app/_service/brand.service';
import { ApiService } from '../../_service/api.service';

@Component({
  selector: 'app-distributors-list',
  templateUrl: './distributors-list.component.html',
  styleUrls: ['./distributors-list.component.scss']
})
export class DistributorsListComponent implements OnInit {
  seletedBrand: BrandsType;
  distributorsList: any[] = [];

  constructor(
    private _brand:BrandService,
    private _api: ApiService,
    private alertService: AlertService
    ) {

      this.seletedBrand = this._brand.getBrand();
      this.getDistributors();
   }

   getDistributors():void{
    this._api.readAllById("distributor", this.seletedBrand._id).subscribe(data => {
      this.distributorsList = data.distributors;
    })
   }

   changeDistributorStatus(id:string, status:boolean):void{
    if (confirm("You want to Change the status")) {
      const data = {id:id, active:status};
      this._api.create("distributor/change-status",data)
      .pipe(first())
      .subscribe(
        (data) => {
          this.getDistributors();
        },
        (error) => {
          this.alertService.error(error);
        }
      );
    }
   }

   delDistributor(id:string):void{
    if(confirm("Conform delete distributor")){
      this._api.deleteIndex("distributor",id).subscribe(data=>{
        this.getDistributors();
      });
    }
   }

  ngOnInit(): void {}

}
