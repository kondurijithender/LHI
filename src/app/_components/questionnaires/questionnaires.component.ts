import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-questionnaires',
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.scss']
})
export class QuestionnairesComponent implements OnInit {

  rapidPageValue = "Learning in my organization isn't primarily seen to be a compliance requirement Learning in my organization isn't primarily ";
  
  DisableEditable = true;

  constructor() { }

  ngOnInit(): void {
  }

  editable(): void{
    this.DisableEditable = false;
  }

  update(): void{
    this.DisableEditable = true;
  }

}
