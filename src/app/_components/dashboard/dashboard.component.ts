import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../_service/api.service"
import { environment } from './../../../environments/environment';
import { BrandsType, BrandService } from "./../../_service/brand.service"
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  brands:BrandsType[];
  serverImagePath = environment.serverUploads;

  constructor(private _api: ApiService, private route: Router, public _brand: BrandService) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(){
    this._api.readAll("brands").subscribe(
      data => {
        this.brands = data.brands;
      }
    );
  }

  gotoBrands(id:string){
    const selectedBrand = this.brands.filter(obj => {
      return obj._id === id
    });
    this._brand.setBrand(selectedBrand[0]);
    this.route.navigateByUrl('distributor', { state: { selectedID: id} });
  }

}
