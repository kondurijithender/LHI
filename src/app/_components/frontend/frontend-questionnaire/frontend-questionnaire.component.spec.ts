import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontendQuestionnaireComponent } from './frontend-questionnaire.component';

describe('FrontendQuestionnaireComponent', () => {
  let component: FrontendQuestionnaireComponent;
  let fixture: ComponentFixture<FrontendQuestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrontendQuestionnaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontendQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
