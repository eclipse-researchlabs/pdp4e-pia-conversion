/*******************************************************************************
 * Copyright (C) 2021 TRIALOG
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/

import { TestBed } from '@angular/core/testing';

import { SendPiaService } from './send-pia.service';

describe('SendPiaService', () => {
  let service: SendPiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendPiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
