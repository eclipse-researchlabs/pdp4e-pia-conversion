import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewPiaComponent } from './dialog-new-pia.component';

describe('DialogNewPiaComponent', () => {
  let component: DialogNewPiaComponent;
  let fixture: ComponentFixture<DialogNewPiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogNewPiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewPiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
