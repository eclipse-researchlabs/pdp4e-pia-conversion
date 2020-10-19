import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssignmentComponent } from './risk-assignment.component';

describe('RiskAssignmentComponent', () => {
  let component: RiskAssignmentComponent;
  let fixture: ComponentFixture<RiskAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
