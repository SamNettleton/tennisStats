import { Component, OnInit } from '@angular/core';
import { MatchHistoryService } from '../matchhistory.service';

@Component({
  selector: 'app-track-match',
  templateUrl: './track-match.page.html',
  styleUrls: ['./track-match.page.scss'],
})
export class TrackMatchPage implements OnInit {

  constructor(private matchHistoryService: MatchHistoryService) { }

  ngOnInit() {
    this.getMatches();
    document.getElementById('p1name').textContent = this.matches[0].getPlayerNames[0];
  }

  getMatches(): void {
    this.matches = this.matchHistoryService.getMatches();
  }

}
