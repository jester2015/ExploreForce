import { TestBed } from '@angular/core/testing';

import { DashboardParserService } from './dashboard-parser.service';

describe('DashboardParserService', () => {
  let service: DashboardParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
