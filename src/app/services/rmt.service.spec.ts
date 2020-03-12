import { TestBed } from '@angular/core/testing';

import { RmtService } from './rmt.service';

describe('RmtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RmtService = TestBed.get(RmtService);
    expect(service).toBeTruthy();
  });
});
