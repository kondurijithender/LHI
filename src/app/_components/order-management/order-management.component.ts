import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/_service/alert.service';
import { ApiService } from 'src/app/_service/api.service';
import { BrandService } from 'src/app/_service/brand.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
})
export class OrderManagementComponent implements OnInit {
  seletedBrand: any;
  serverImagePath = `${environment.serverUploads}/uploads`;

  defaultImage: string = '../../assets/images/uploadImage.png';
  searchText: any = '';
  distributorSelected: boolean = false;
  selectedDistributor: any;
  distributors = [];
  distributorsList: any;
  totalAmount = 0;
  isOrderTimeOut: boolean = false;
  accountStatus: true;
  constructor(
    public _brands: BrandService,
    private apiService: ApiService,
    private alertService: AlertService,
    private router: Router
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
    this.isOrderTimeOut = false;
  }
  searchDistributor() {
    this.selectedDistributor = this.distributorsList.find(
      (res: any) => res.code === this.searchText
    );
    this.searchText = '';
    this.distributorSelected = false;
    this.accountStatus = this.selectedDistributor.active;
    if(this.compareTime(this.selectedDistributor.route.closeTime, moment().format('HH:MM')) === -1) {
      this.isOrderTimeOut = true;
    }
  }
  addQty(event: any, product: any, i: number) {
    const qty = event.target.value;
    this.selectedDistributor.products[i]['qty'] = qty;
    this.totalAmount = this.selectedDistributor.products
      .map((res: any) => {
        let total = 0;
        if (res.qty) {
          total += res.qty * res.price;
        }
        return total;
      })
      .reduce((a: number, b: number) => a + b);
  }
  addToCart() {
    localStorage.setItem('cartItem', JSON.stringify(this.selectedDistributor));
    this.router.navigate(['/order-invoice']);
  }
  private compareTime(str1: any, str2: any) {
    if (str1 === str2) {
      return 0;
    }
    var time1 = str1.split(':');
    var time2 = str2.split(':');
    if (eval(time1[0]) > eval(time2[0])) {
      return 1;
    } else if (
      eval(time1[0]) == eval(time2[0]) &&
      eval(time1[1]) > eval(time2[1])
    ) {
      return 1;
    } else {
      return -1;
    }
  }
}
