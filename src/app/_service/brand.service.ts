import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

export class BrandsType {
  name: string;
  _id: string;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class BrandService {
  
  public currentBrandData: BrandsType;

  setBrand(data: BrandsType): void{
    localStorage.setItem('selectedBrand', JSON.stringify(data));
  }

  getBrand(): BrandsType{
    return JSON.parse(localStorage.getItem('selectedBrand') || '{}');
  }

}
