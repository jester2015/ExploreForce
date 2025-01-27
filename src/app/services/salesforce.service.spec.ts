import { TestBed } from '@angular/core/testing';

import { SalesforceService } from './salesforce.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';

describe('SalesforceService', () => {
  let service: SalesforceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideMarkdown()]
    });
    service = TestBed.inject(SalesforceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
