import { TestBed } from '@angular/core/testing';

import { RecipeParserService } from './recipe-parser.service';

describe('RecipeParserService', () => {
  let service: RecipeParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
