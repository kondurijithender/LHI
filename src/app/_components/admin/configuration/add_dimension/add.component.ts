import { ApiService } from '../../../../_service/api.service';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  selector: 'app-dimension',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddDimensionComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  id: string;
  formType: string = 'Add New';
  isValid: boolean = false;
  dimensionsList: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private apiService: ApiService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.id = params.id;
      if (this.id) {
        this.formType = 'Update';
      }
    });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      score: ['', Validators.required]
    });
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
    if (this.form.invalid) {
      return;
    }
    this.loading = true;

    this.apiService
      .create('dimension', this.form.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success(data.message);
          this.router.navigate(['admin/configuration']);
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
