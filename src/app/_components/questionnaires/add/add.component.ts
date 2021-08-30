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
        this.loadQuestionnairesDetails();
    }
    });

  }

  

  ngOnInit() {
    this.loadDimensions();
    this.form = this.formBuilder.group({
      questionnaire: ['', Validators.required],
      dimensionId: ['', Validators.required],
      blockIndex: ['', Validators.required],
      type: ['', Validators.required]
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
    console.log(this.form, this.form.invalid , this.isValid);
    
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if (!this.id) {
      this.apiService
        .create('questionnaire', this.form.value)
        .pipe(first())
        .subscribe(
          (data) => {
            this.alertService.success(data.message);
            this.router.navigate(['questionnaires']);
          },
          (error) => {
            this.alertService.error(error);
            this.loading = false;
          }
        );
    } else {
      this.apiService
        .update('questionnaire', this.form.value, this.id)
        .pipe(first())
        .subscribe(
          (data) => {
            this.alertService.success(data.message);
            this.router.navigate(['questionnaires']);
          },
          (error) => {
            this.alertService.error(error);
            this.loading = false;
          }
        );
    }
  }
  loadQuestionnairesDetails() {
    this.apiService
      .readSingle('questionnaire', this.id)
      .pipe(first())
      .subscribe(
        (data) => {
          const dimensionId = data.questionnaire.dimensionId ? data.questionnaire.dimensionId[0]._id : '';
          this.f.questionnaire.setValue(data.questionnaire.questionnaire);
          this.f.dimensionId.setValue(dimensionId);
          this.f.blockIndex.setValue(data.questionnaire.blockIndex);
          this.f.type.setValue(data.questionnaire.type);
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
  loadDimensions() {
    this.apiService
      .readAll('dimension')
      .subscribe(
        (data) => {
          this.dimensionsList = data.dimensions;
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
