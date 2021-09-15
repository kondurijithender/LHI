import { ApiService } from '../../../../_service/api.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_service/alert.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-industry',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddIndustryComponent implements OnInit {
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
      companies: ['', Validators.required],
      D1: ['', Validators.required],
      D2: ['', Validators.required],
      D3: ['', Validators.required],
      D4: ['', Validators.required],
      D5: ['', Validators.required],
      D6: ['', Validators.required],
      D7: ['', Validators.required],
      D8: ['', Validators.required]
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
      .create('industry', this.form.value)
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
