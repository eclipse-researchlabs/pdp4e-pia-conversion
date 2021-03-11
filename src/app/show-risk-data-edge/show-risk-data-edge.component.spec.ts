/*******************************************************************************
 * Copyright (C) 2021 TRIALOG
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/

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
