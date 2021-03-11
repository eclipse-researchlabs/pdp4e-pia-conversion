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

import { ModalConfigComponent } from './modal-config.component';

describe('ModalConfigComponent', () => {
  let component: ModalConfigComponent;
  let fixture: ComponentFixture<ModalConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
