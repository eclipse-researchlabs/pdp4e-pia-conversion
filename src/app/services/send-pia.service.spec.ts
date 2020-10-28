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
