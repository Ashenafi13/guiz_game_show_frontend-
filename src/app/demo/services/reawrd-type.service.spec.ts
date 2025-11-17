import { TestBed } from '@angular/core/testing';

import { ReawrdType } from './reawrd-type.service';

describe('ReawrdType', () => {
  let service: ReawrdType;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReawrdType);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
