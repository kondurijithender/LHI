import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  DimentionEdit = false;
  
  constructor() { }

  ngOnInit(): void {
  }

  editable(): void{
    this.DimentionEdit = true;
  }

  update(): void{
    this.DimentionEdit = false;
  }

}
