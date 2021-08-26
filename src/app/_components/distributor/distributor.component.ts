import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/_service/api.service';
import { BrandService, BrandsType } from 'src/app/_service/brand.service';

@Component({
  selector: 'app-distributor',
  templateUrl: './distributor.component.html',
  styleUrls: ['./distributor.component.scss']
})
export class DistributorComponent implements OnInit {
  seletedBrand: BrandsType;

  constructor(public route: ActivatedRoute, public _api: ApiService, public _brands: BrandService) {
    this.seletedBrand = this._brands.getBrand();
  }
  
  ngOnInit(): void {
    
  }

}
