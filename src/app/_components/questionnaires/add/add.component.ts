import { ApiService } from '../../../_service/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_service/alert.service';
import { first } from 'rxjs/operators';

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
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddQuestionnairesComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  id: string;
  formType: string = 'Add New';
  isValid: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private apiService: ApiService
  ) {}

  

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
}
