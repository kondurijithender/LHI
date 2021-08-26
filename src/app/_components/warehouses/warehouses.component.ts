import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/_service/api.service';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../_service/alert.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss']
})
export class WarehousesComponent implements OnInit {

  warehouses:any[];
  serverImagePath = environment.serverUploads;
  closeResult: string = "Model";
  addWarehouseform: FormGroup;
  submitted: Boolean;
  loading: Boolean;

  constructor(
    private _api: ApiService, 
    private route: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private alertService: AlertService
    ) {}

  ngOnInit(): void {
    this.loadWareHouses();
    this.addWarehouseform = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
    });
  }

  onChangeEvent(event: any){
    this.f.code.setValue(event.target.value[0]);
  }

  get f() {
    return this.addWarehouseform.controls;
  }

  loadWareHouses(){
    this._api.readAll("warehouse").subscribe(
      data => {
        this.warehouses = data.warehouses;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  open(content:any) {
    this.addWarehouseform.reset();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  gotoRoute(id:string, name:string, code:string){
    localStorage.setItem('selectedWarehouse', JSON.stringify({
      WarehouseID: id, 
      WarehouseName: name,
      WarehouseCode: code
    }));
    this.route.navigate(['/routes'])
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    if (this.addWarehouseform.invalid && !this.addWarehouseform.value.image) {
      return;
    }

    const formData:FormData = new FormData();
    formData.append('name', this.addWarehouseform.get('name')?.value);
    formData.append('code', this.addWarehouseform.get('code')?.value);
    // stop here if form is invalid
    this.loading = true;
    this._api
      .create("warehouse", formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loadWareHouses();
          this.modalService.dismissAll();
          this.addWarehouseform.reset();
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }

}
