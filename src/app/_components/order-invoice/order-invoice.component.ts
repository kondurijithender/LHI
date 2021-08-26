import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_service/api.service';
import { BrandService } from 'src/app/_service/brand.service';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/_service/alert.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-invoice',
  templateUrl: './order-invoice.component.html',
  styleUrls: ['./order-invoice.component.scss'],
})
export class OrderInvoiceComponent implements OnInit {
  seletedBrand: any;
  serverImagePath = `${environment.serverUploads}/uploads`;
  cartProducts: any;
  totalAmount = 0;

  searchText = '';
  defaultImage: string = "../../assets/images/uploadImage.png";

  constructor(
    public _brands: BrandService,
    private apiService: ApiService,
    private router: Router,
    private alertService: AlertService,
    private toastr: ToastrService
  ) {
    this.seletedBrand = this._brands.getBrand();
  }

  ngOnInit(): void {
    this.getCartProducts();
  }
  getCartProducts() {
    this.cartProducts = JSON.parse(localStorage.getItem('cartItem') || '{}');
    this.orderProducts();
  }
  orderProducts() {
    this.totalAmount = this.cartProducts.products
      .map((res: any) => {
        let total = 0;
        if (res.qty) {
          total += res.qty * res.price;
        }
        return total;
      })
      .reduce((a: number, b: number) => a + b);
  }
  addQty(event: any, product: any, i: number) {
    const qty = event.target.value;
    this.cartProducts.products[i]['qty'] = qty;
    this.orderProducts();
  }
  placeOrder() {
    let total = 0;
    const products = this.cartProducts.products.map((products: any) => {
      total += products.qty * products.price;
      let orderProducts = {
        productId: products.productId._id,
        qty: products.qty,
        total_packets: products.productId.packet,
        total: total,
      };
      return orderProducts;
    });
    const orderProducts = {
      distributorId: this.cartProducts._id,
      product: products,
      outstanding_price: 0,
      total: total,
    };
    this.apiService
      .create('place-order', orderProducts)
      .pipe(first())
      .subscribe(
        (data) => {
          this.toastr.success(data.message);
          this.alertService.success(data.message);
          localStorage.removeItem('cartItem');
          this.router.navigate(['/distributor']);
        }
      );
  }
}
