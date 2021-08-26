import { ApiService } from 'src/app/_service/api.service';
import { Component, OnInit } from '@angular/core';
import { BrandService } from 'src/app/_service/brand.service';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/_service/alert.service';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss'],
})
export class AccountManagementComponent implements OnInit {
  seletedBrand: any;

  searchText: any = '';
  distributorSelected: boolean = false;
  selectedDistributor: any;
  distributors = [];
  distributorsList = [];
  constructor(
    public _brands: BrandService,
    private apiService: ApiService,
    private alertService: AlertService
  ) {
    this.seletedBrand = this._brands.getBrand();
  }

  ngOnInit(): void {
    this.getAllBrandWiseDistributors();
  }
  getAllBrandWiseDistributors() {
    this.apiService
      .readAllById('distributor', this.seletedBrand._id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.distributors = data.distributors.map((res: any) => res.code);
          this.distributorsList = data.distributors;
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }
  selectDestributor(destributor: any) {
    this.searchText = destributor;
    this.distributorSelected = true;
  }
  searchDistributor() {
    this.selectedDistributor = this.distributorsList.find(
      (res: any) => res.code === this.searchText
    );
    this.searchText = '';
    this.distributorSelected = false;
  }
}
