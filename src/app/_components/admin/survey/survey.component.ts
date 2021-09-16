import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../_service/api.service';
import { AlertService } from 'src/app/_service/alert.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  surveyList: any[] = [];

  constructor(private alertService: AlertService, private _api: ApiService) { }

  ngOnInit(): void {
    this.getAllSurvey();
  }
  getAllSurvey() {
    this._api.readAll("survey-list").subscribe(data => {
      this.surveyList = data.survey;
    })
  }
}
