import { TestBed } from '@angular/core/testing';

import { PiaService } from './pia.service';

describe('PiaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PiaService = TestBed.get(PiaService);
    expect(service).toBeTruthy();
  });
});
