import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRiskDataEdgeComponent } from './show-risk-data-edge.component';

describe('ShowRiskDataComponent', () => {
  let component: ShowRiskDataEdgeComponent;
  let fixture: ComponentFixture<ShowRiskDataEdgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowRiskDataEdgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRiskDataEdgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
