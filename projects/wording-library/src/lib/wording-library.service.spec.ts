import { TestBed } from '@angular/core/testing';

import { WordingLibraryService } from './wording-library.service';

describe('WordingLibraryService', () => {
  let service: WordingLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordingLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
