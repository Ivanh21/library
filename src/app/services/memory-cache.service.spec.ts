import { TestBed } from '@angular/core/testing';

import { MemoryCacheService } from './memory-cache.service';

describe('MemoryCacheService', () => {
  let service: MemoryCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoryCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
