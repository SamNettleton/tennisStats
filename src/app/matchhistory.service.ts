import { Injectable } from '@angular/core';
import { Match } from "src/app/match";

@Injectable({
  providedIn: 'root'
})
export class MatchHistoryService {

  public MATCHES: Match[] = [];
  constructor() { }

  getMatches(): Match[] {
    return this.MATCHES;
  }

  addMatch(match: Match) {
    this.MATCHES.push(match);
  }

}
