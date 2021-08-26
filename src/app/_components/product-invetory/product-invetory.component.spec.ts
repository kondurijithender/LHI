import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInvetoryComponent } from './product-invetory.component';

describe('ProductInvetoryComponent', () => {
  let component: ProductInvetoryComponent;
  let fixture: ComponentFixture<ProductInvetoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductInvetoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductInvetoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
