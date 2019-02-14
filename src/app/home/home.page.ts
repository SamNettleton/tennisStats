import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MatchHistoryService } from '../matchhistory.service';
import { Match } from "src/app/match";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  private matches: Match[]
  constructor( private matchHistoryService: MatchHistoryService ) { }

  ngOnInit() {
    this.matches = this.matchHistoryService.getMatches();
  }

}
