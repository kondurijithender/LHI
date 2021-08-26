import { DistributorComponent } from './../distributor/distributor.component';
import { ApiService } from './../../_service/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_service/alert.service';
import { first } from 'rxjs/operators';
import { BrandService, BrandsType } from 'src/app/_service/brand.service';

class productdata {
  productId: string;
  price: string;
  name: string;
}

class productdataNew {
  productId: string;
  price: number;
}

@Component({
  selector: 'app-add-distributor',
  templateUrl: './add-distributor.component.html',
  styleUrls: ['./add-distributor.component.scss'],
})
export class AddDistributorComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  id: string;
  formType: string = 'Add New';
  priceValidation = false;
  routeList: any[];
  originalRouteList: any[];
  warehouseList: any[];
  DropPoint: any[];
  seletedBrand: BrandsType;
  brandProducts: any;
  productValue: productdata[] = [];
  pushProducts: productdataNew[] = [];
  isValid: boolean = false;
  isManual: boolean = true;
  distributorCode: string = '';
  code: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private apiService: ApiService,
    public _brands: BrandService
  ) {
    this.seletedBrand = this._brands.getBrand();
    this.route.queryParams.subscribe((params) => {
      this.id = params.id;
      if (this.id) {
        this.loadDistributorDetails();
      }
    });

    this.apiService
      .readAll(`products?brandId=${this.seletedBrand._id}`)
      .subscribe((data) => {
        this.brandProducts = data.products;

        for (let product of this.brandProducts) {
          this.productValue.push({
            productId: product._id,
            price: '0',
            name: product.name,
          });
        }
      });

    this.apiService
      .readAll('warehouse')
      .subscribe((data) => (this.warehouseList = data.warehouses));
  }

  onChangeWarehouse(value: any) {
    this.DropPoint = [];
    this.apiService
      .readAllByWareHouseId('route', value)
      .subscribe((data) => (this.routeList = data.routes));
    this.distributorCodeGenerate();
  }
  onChangeRoute(value: any) {
    this.DropPoint = this.routeList.filter(
      (item) => item._id === value
    )[0]['locations'];
    this.distributorCodeGenerate();
  }

  loadDistributorDetails() {
    this.apiService
      .readSingle('distributor', this.id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.f.name.setValue(data.distributor.name);
          this.f.route.setValue(data.distributor.route._id);
          this.f.email.setValue(data.distributor.email);
          this.f.phone.setValue(data.distributor.phone);
          this.f.address.setValue(data.distributor.address);
          this.f.crateLimit.setValue(data.distributor.crateLimit);
          this.f.cashLimit.setValue(data.distributor.cashLimit);
          this.f.warehouse.setValue(data.distributor.route.warehouse);
          this.onChangeWarehouse(data.distributor.route.warehouse);
          this.f.route.setValue(data.distributor.route._id);
          this.f.password.setValue(data.distributor.password);
          // this.onChangeRoute(data.distributor.route._id);
          this.f.dropPoint.setValue(data.distributor.dropPoint);
          this.formType = `Edit ${data.distributor.name}`;
          this.distributorCode = data.distributor.code;
          this.isValid = true;
          for (let item of this.productValue) {
            data.distributor.products.filter((test: any) => {
              if (item.productId === test.productId._id) {
                item.price = test.price;
              }
            });
          }
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      brand: [
        { value: this.seletedBrand.name, disabled: true },
        Validators.required,
      ],
      warehouse: ['', Validators.required],
      code: [''],
      route: ['', Validators.required],
      dropPoint: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      crateLimit: ['', Validators.required],
      cashLimit: ['', Validators.required],
      password: ['', Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onChangeEvent(event: any, productId: any) {
    this.productValue.filter((item) => item.productId === productId)[0].price =
      event.target.value;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid || !this.isValid) {
      return;
    }
    this.loading = true;

    this.form.value.brand = this.seletedBrand._id;
    for (let item of this.productValue) {
      if (item.price == '0' && item.price == null && !item.price) {
        this.priceValidation = true;
        this.loading = false;
        return;
      }
    }
    this.priceValidation = false;

    for (let item of this.productValue) {
      this.pushProducts.push({
        productId: item.productId,
        price: Number(item.price),
      });
    }

    this.form.value.products = this.pushProducts;

    if (!this.id) {
      this.apiService
        .create('distributor', this.form.value)
        .pipe(first())
        .subscribe(
          (data) => {
            this.router.navigate(['distributors']);
          },
          (error) => {
            this.alertService.error(error);
            this.loading = false;
          }
        );
    } else {
      this.apiService
        .update('distributor', this.form.value, this.id)
        .pipe(first())
        .subscribe(
          (data) => {
            this.router.navigate(['distributors']);
          },
          (error) => {
            this.alertService.error(error);
            this.loading = false;
          }
        );
    }
  }
  distributorCodeGenerate(manual = false) {
    const warehouse =
      this.warehouseList &&
      this.warehouseList.find(
        (res: any) => res._id === this.form.value.warehouse
      );
    const route =
      this.routeList &&
      this.routeList.find((res: any) => res._id === this.form.value.route);
    const dropPoint = this.form.value.dropPoint;
    const name = this.form.value.name;
    const code = this.form.value.code;

    let distributorCode = '';
    if (warehouse)
      distributorCode += `${warehouse.name.substring(0, 1).toUpperCase()}`;
    if (dropPoint)
      distributorCode += `${dropPoint.substring(0, 2).toUpperCase()}`;
    if (route) distributorCode += `${route.name.substring(1, 3).toUpperCase()}`;
    distributorCode += `${this.seletedBrand.name
      .substring(0, 2)
      .toUpperCase()}`;
    if (name && !manual) {
      distributorCode += `${name.substring(0, 3).toUpperCase()}`;
      this.code = `${name.substring(0, 3).toUpperCase()}`;
      this.f.code.setValue(this.code);
    }
    if (code && manual) {
      distributorCode += `${code.substring(0, 3).toUpperCase()}`;
      this.code = `${code.substring(0, 3).toUpperCase()}`;
    }
    this.distributorCode = distributorCode;
    if (warehouse && dropPoint && route && this.code.length > 2) {
      this.apiService
        .checkExists('distributor-exists', this.distributorCode)
        .subscribe(
          (data) => {
            this.isValid = true;
            this.isValid = true;
          },
          (error) => {
            this.isManual = false;
            this.isValid = false;
          }
        );
    }
  }
  passwordGen() {
    this.f.password.setValue(Math.random().toString(36).slice(-6));
  }
}
