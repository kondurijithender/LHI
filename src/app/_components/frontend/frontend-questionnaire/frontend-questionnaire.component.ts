import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../_service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-frontend-questionnaire',
  templateUrl: './frontend-questionnaire.component.html',
  styleUrls: ['./frontend-questionnaire.component.scss'],
})
export class FrontendQuestionnaireComponent implements OnInit {
  surveyDetails: any;
  questionnairesList: any;
  loading = false;
  submitted = false;
  BlockIndexList: any;
  currentIndex: any = 1;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('surveyDetails') !== null) {
      this.surveyDetails = JSON.parse(
        localStorage.getItem('surveyDetails') || '{}'
      );
    } else {
      this.router.navigate(['/']);
    }
    this.getQuestionnaires();
  }
  getQuestionnaires() {
    this.apiService.readAll('questionnaire').subscribe((data) => {
      this.questionnairesList = data.questionnaires;
      console.log(this.questionnairesList);
    });
  }
  changeList(event: any, el: HTMLElement, index: number)
  {
    if (index)
      this.currentIndex++
    else
      this.currentIndex--
    el.scrollIntoView()
  }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    console.log(this.questionnairesList);
    this.surveyDetails['questionnaires'] = this.questionnairesList;
    this.apiService
    .create('survey', this.surveyDetails)
    .pipe(first())
    .subscribe(
      (data) => {
        localStorage.removeItem('surveyDetails');
        this.router.navigate(['results'],{ queryParams: {id: data.message}});
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  selectedOption(index: any, option: any, value: any) {
    console.log(this.questionnairesList[index]);
    this.questionnairesList[index]['selectedOption'] = option;
    this.questionnairesList[index]['selectedvalue'] = value;
  }
}
