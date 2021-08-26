import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ApiService } from './../../../app/_service/api.service';
import { AlertService } from './../../../app/_service/alert.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.scss'],
})
export class AddRouteComponent implements OnInit {

  RouterValid: any = true;
  DropPointList:string[] = ["","",""];
  id:string;
  formType: string = "Add New";
  addRoute: FormGroup;
  submitted: boolean;
  loading: boolean;
  WarehouseData: any;
  warehouseID: string;
  warehouseName: string;
  warehouseCode: string;
  RoutesList: any[] = [];
  routeName:string;

  constructor(
    private apiService:ApiService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
      this.WarehouseData =  JSON.parse(localStorage.getItem('selectedWarehouse') || '[]');
      this.warehouseID = this.WarehouseData.WarehouseID;
      this.warehouseName = this.WarehouseData.WarehouseName;
      this.warehouseCode = this.WarehouseData.WarehouseCode;

      this.route.queryParams.subscribe(params => {
        this.id = params.id;
        let count = String(Number(params.count)+1);
        if (Number(params.count) < 10){
          count = `0${count}`
        }
        if(params.count){
          this.routeName = `${this.warehouseCode}${count}`
        }
        if(this.id) {
          this.loadRouteDetails();
        }
      })

    }

  ngOnInit(): void {
    this.addRoute = this.formBuilder.group({
      warehouse: {value: this.warehouseName, disabled: true},
      name: {value: this.routeName, disabled: true},
      openTime: ['', Validators.required],
      closeTime: ['', Validators.required],
      code: [`${this.warehouseName.slice(0,3).toUpperCase()}${this.routeName}`],
      password: ['', Validators.required]
    });
  }

  loadRouteDetails() {
    this.apiService
      .readSingle("route", this.id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.f.name.setValue(data.route.name);
          this.f.name.disable();
          this.f.openTime.setValue(data.route.openTime);
          this.f.closeTime.setValue(data.route.closeTime);
          this.f.password.setValue(data.route.password);
          this.f.code.setValue(data.route.code);
          this.f.warehouse.setValue(this.warehouseName);
          this.f.warehouse.disable();
          this.DropPointList = data.route.locations;

          this.formType = data.route.name;
        },
        (error) => {
          console.log(error)
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }

  passwordGen() {
    this.f.password.setValue(Math.random().toString(36).slice(-6));
  }

  addDropPoint(index:any):void{
    (this.DropPointList.length < 15) ? this.DropPointList.push("") : console.log("Drop Point List Count reached")
  }

  dropPoint(event:any, i:any){
    this.DropPointList[i] = event.target.value;
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addRoute.controls;
  }

  onNewRouteSubmit():void{
    this.submitted = true;
    console.log(this.addRoute)
    this.addRoute.value.name = this.routeName;
    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.addRoute.invalid) {
      return;
    }
    this.addRoute.value.warehouse=this.warehouseID;
    this.loading = true;
    this.addRoute.value.locations=this.DropPointList;

    if (!this.id){
      this.apiService
      .create("route", this.addRoute.value)
      .pipe(first())
      .subscribe(
        (data) => {
            this.alertService.success("Route Created Succesfully");
            this.router.navigate(['routes']);
          },
          (error) => {
            console.log(error)
            this.alertService.error(error);
            this.loading = false;
          }
        );
    }else{
      this.apiService
      .update("route", this.addRoute.value, this.id)
      .pipe(first())
      .subscribe(
        (data) => {
            this.alertService.success("Route Created Succesfully");
            this.router.navigate(['routes']);
          },
          (error) => {
            console.log(error)
            this.alertService.error(error);
            this.loading = false;
          }
        );
    }
  }
}
