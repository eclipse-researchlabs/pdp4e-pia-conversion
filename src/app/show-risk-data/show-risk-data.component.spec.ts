import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRiskDataComponent } from './show-risk-data.component';

describe('ShowRiskDataComponent', () => {
  let component: ShowRiskDataComponent;
  let fixture: ComponentFixture<ShowRiskDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowRiskDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRiskDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
