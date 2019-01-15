import { Injectable } from '@angular/core';
import { Match } from "src/app/match";

@Injectable({
  providedIn: 'root'
})
export class MatchHistoryService {

  public MATCHES: Match[] = [];
  constructor() { }

  getMatches(): Match[] {
    debugger;
    return this.MATCHES;
  }

  addMatch(Match: match) {
    debugger;
    this.MATCHES.push(match);
  }
}
