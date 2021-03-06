import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../_service/api.service"
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'frontend-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class FrontEndDashboardComponent implements OnInit {
  loading = false;
  submitted = false;
  form: FormGroup;
  dimensionsList:any = [];
  countryList = [
    "USA",
    "Europe",
    "India",
    "South East Asia",
    "Australia & New Zealand",
    "Middle East",
    "Africa"
  ];

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      companyName: ['', Validators.required],
      businessSector: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required]
    });
    this.loadBusinessSectors();
  }
   // convenience getter for easy access to form fields
   get f() {
    return this.form.controls;
  }
  onSubmit() {
    this.submitted = true;
        // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    localStorage.setItem('surveyDetails', JSON.stringify(this.form.value));
    this.router.navigate(["/questionnaires"]);
  }
  loadBusinessSectors() {
    this.apiService
    .readAll('industry')
    .subscribe(
      (data) => {
        this.dimensionsList = data.industries.sort((a: any, b: any) => a.name.localeCompare(b.name));;
      },
      (error) => {
        this.loading = false;
      }
    );
  }
}
