import { TestBed } from '@angular/core/testing';

import { BaseParserService } from './base-parser.service';

describe('BaseParserService', () => {
  let service: BaseParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
