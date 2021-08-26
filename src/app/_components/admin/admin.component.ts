import { ApiService } from './../../_service/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  admins: any;
  constructor( private apiService: ApiService) { }

  ngOnInit(): void {
    this.adminList();
  }
  adminList():void{
    this.apiService.readAll("admin").subscribe((data: any) => {
      this.admins = data.users;
    })
   }

   remove(id: string, name: string){
    if(confirm(`Conform delete ${name}`)){
      this.apiService.deleteIndex("admin",id).subscribe(data=>{
        this.adminList();
      });
    }
  }

}
