import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../_service/api.service';
import { AlertService } from 'src/app/_service/alert.service';

@Component({
  selector: 'app-questionnaires',
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.scss']
})
export class QuestionnairesComponent implements OnInit {
  questionnairesList: any[] = [];

  constructor(private alertService: AlertService, private _api: ApiService) { }

  ngOnInit(): void {
    this.getQuestionnaires();
  }
  getQuestionnaires() {
    this._api.readAll("questionnaire").subscribe(data => {
      this.questionnairesList = data.questionnaires;
    })
  }
  delQuestionnaire(id:string):void{
    if(confirm("Conform delete Questionnaire")){
      this._api.deleteIndex("questionnaire",id).subscribe(data=>{
        this.getQuestionnaires();
      });
    }
  }

}
