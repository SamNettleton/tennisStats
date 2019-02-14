import { TestBed } from '@angular/core/testing';

import { MatchStorageService } from './match-storage.service';

describe('MatchStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatchStorageService = TestBed.get(MatchStorageService);
    expect(service).toBeTruthy();
  });
});
