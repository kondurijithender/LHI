import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../_service/api.service';
import { BrandService, BrandsType } from './../../_service/brand.service';
import { AlertService } from 'src/app/_service/alert.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-invetory',
  templateUrl: './product-invetory.component.html',
  styleUrls: ['./product-invetory.component.scss']
})
export class ProductInvetoryComponent implements OnInit {

  seletedBrand: BrandsType;
  closeResult: string = "Model";
  products: any[];
  addProductform: FormGroup;
  loading:boolean;
  submitted: boolean;
  uploadedProductImage: File;
  productimgCheck: boolean = false;
  productImage: string = "../../../assets/images/uploadImage.png";
  serverImagePath = `${environment.serverUploads}/uploads`;

  defaultImage: string = "../../assets/images/uploadImage.png";

  constructor(
    private modalService: NgbModal,
    public _brands: BrandService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    ) {
      this.seletedBrand = this._brands.getBrand();
      this.loadProducts();
    }

  loadProducts():void{
    this.apiService.readAll(`products?brandId=${this.seletedBrand._id}`).subscribe(data => {
      this.products = data.products;
    })
  }

  changeProductStatus(product_id:string, event:any):void{
    const data = {id:product_id, active:event};
    this.apiService.create("products/change-status",data)
    .pipe(first())
    .subscribe(
      (data) => {
        this.loadProducts();
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }


  ngOnInit(): void {
    this.addProductform = this.formBuilder.group({
      name: ['', Validators.required],
      packet: ['', Validators.required],
      image: [""],
      brandId: [this.seletedBrand._id]
    });
  }

  remove(id: string, name: string){
    if(confirm(`Conform delete ${name}`)){
      this.apiService.deleteIndex("products",id).subscribe(data=>{
        this.loadProducts();
      });
    }
  }

  edit(content:any, id: string, name: string){
    this.modalService.open(content);
    this.products.filter((item:any) => {
      if (item._id == id) this.f.name.setValue(name);
    });
  }

  get f() {
    return this.addProductform.controls;
  }

  open(content:any) {
    this.addProductform.reset();
    this.productImage = "../../../assets/images/uploadImage.png";
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  uploadImage(event:any):void{
    if(event.target.files){
      this.loadProducts();
      let reader = new FileReader();
      this.uploadedProductImage = <File>event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any)=>{
        this.productImage = event.target.result;
      }
    }
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    if(this.uploadedProductImage){
      this.addProductform.value.image = this.uploadedProductImage;
    }

    if(!this.addProductform.value.image){
      this.productimgCheck = true;
    }

    if (this.addProductform.invalid && !this.addProductform.value.image) {
      return;
    }

    const formData:FormData = new FormData();
    formData.append('image', this.addProductform.value.image);
    formData.append('name', this.addProductform.get('name')?.value);
    formData.append('packet', this.addProductform.get('packet')?.value);
    formData.append('brandId', this.seletedBrand._id);
    // stop here if form is invalid
    this.loading = true;
    this.apiService
      .create("products", formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loadProducts();
          this.modalService.dismissAll();
          this.addProductform.reset();
          this.productImage = "../../../assets/images/uploadImage.png";
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }

}
