import { ApiService } from '../../../../_service/api.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  options: any = [
    {
      name: "Strongly Disagree",
      value: "1"
    },
    {
      name: "Disagree",
      value: "2"
    },
    {
      name: "Neutral",
      value: "3"
    },
    {
      name: "Agree",
      value: "4"
    },
    {
      name: "Strongly Agree",
      value: "5"
    }
  ];
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
      options: this.createOptions(this.options),
      values: this.createOptionsvalues(this.options)

    });
    console.log(this.form.controls['options']);
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }
  createOptions(input: any) {
    const arr = input.map((i: any) => {
      return new FormControl(i.name || false);
    });
    return new FormArray(arr);
  }
  createOptionsvalues(input: any) {
    const arr = input.map((i: any) => {
      return new FormControl(i.value || false);
    });
    return new FormArray(arr);
  }
  onSubmit() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    console.log(this.form);
    
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
            this.router.navigate(['admin/questionnaires']);
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
            this.router.navigate(['admin/questionnaires']);
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
          this.f.options.setValue(data.questionnaire.options);
          this.f.value.setValue(data.questionnaire.value);
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
