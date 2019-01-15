import { TestBed } from '@angular/core/testing';
import { Match } from "src/app/match";
import { MatchhistoryService } from './matchhistory.service';

describe('MatchHistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatchHistoryService = TestBed.get(MatchHistoryService);
    expect(service).toBeTruthy();
  });
});
