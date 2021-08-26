import { ApiService } from './../../../_service/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_service/alert.service';
import { first } from 'rxjs/operators';
import { BrandService, BrandsType } from 'src/app/_service/brand.service';


@Component({
  selector: 'app-admin-create',
  templateUrl: './admin-create.component.html',
  styleUrls: ['./admin-create.component.scss']
})
export class AdminCreateComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  id: any;
  formType = 'create';
  brands: any[];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private apiService: ApiService,
    public _brands: BrandService
  ) {
  }

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.id = params.id;
      if(this.id) {
        this.loadAdminDetails();
      }

    }
  );
    this.loadBrands();
    this.form = this.formBuilder.group({
      brandId: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(15)]],
      username: ['', [Validators.required, Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }
  loadBrands(){
    this.apiService.readAll("brands").subscribe(
      data => {
        this.brands = data.brands;
      }
    );
  }
  loadAdminDetails() {
    this.apiService
      .readSingle("admin", this.id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.f.brandId.setValue(data.user.brandId);
          this.f.name.setValue(data.user.name);
          this.f.username.setValue(data.user.username);
          this.f.email.setValue(data.user.email);
          this.formType = `Edit ${data.user.username}`;
          this.f.password.setValidators([]);
          this.f.password.updateValueAndValidity();

        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if(!this.id) {
      this.apiService
      .create("admin", this.form.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate(['admin']);
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
    } else {
      this.apiService
      .update("admin", this.form.value, this.id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate(['admin']);
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
    }

  }
}
