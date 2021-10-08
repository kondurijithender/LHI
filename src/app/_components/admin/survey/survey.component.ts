import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../_service/api.service';
import { AlertService } from 'src/app/_service/alert.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent implements OnInit {
  surveyList: any[] = [];
  serverUploads = environment.serverUploads;
  downloadInProgress = false;

  constructor(private alertService: AlertService, private _api: ApiService) {}

  ngOnInit(): void {
    this.getAllSurvey();
  }
  getAllSurvey() {
    this._api.readAll('survey-list').subscribe((data) => {
      this.surveyList = data.survey;
    });
  }
  download() {
    this.downloadInProgress = true;
    this._api.readAll('download-users').subscribe(
      (data) => {
        setTimeout(() => {
          const link = document.createElement('a');
          if (link.download !== undefined) {
            link.setAttribute('href', `${this.serverUploads}/users.xlsx`);
            link.setAttribute('download', 'users.xlxs');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.downloadInProgress = false;
          }
        }, 1500);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
