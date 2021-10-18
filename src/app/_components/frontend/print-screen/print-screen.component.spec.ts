import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintScreenComponent } from './print-screen.component';

describe('PrintScreenComponent', () => {
  let component: PrintScreenComponent;
  let fixture: ComponentFixture<PrintScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
