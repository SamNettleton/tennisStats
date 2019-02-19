import { Component } from '@angular/core';
import { Match } from "src/app/match";
import { MatchHistoryService } from '../matchhistory.service';
import { Platform, IonList } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public matches: Match[];
  public currentMatch: Match;
  public rallyLengths: number[];
  public serverWins: number[][] = [];
  public serverLosses: number[][] = [];

  constructor(private matchHistoryService: MatchHistoryService, private plt: Platform) {
    this.plt.ready().then(() => {
      this.loadItems();
    });
  }

  ngOnInit() {
    this.getMatches();
    this.rallyLengths = this.currentMatch.getRallyLengths(2);
    this.sortData();
  }

  loadItems() {
    this.matchHistoryService.getMatches().then(items => {
      this.matches = items;
    });
  }

  getMatches(): void {
    this.currentMatch = this.matches[0];
    //this.currentMatch = this.matchHistoryService.getCurrentMatch();
  }

  sortData(): void {
    //sort the data so that it is in order
    var sortedArray: number[] = this.rallyLengths.sort((n1,n2) => n1 - n2);
    //loop through the data and diverge into two separate lists
    //each list will maintain the x value from rally lengths, with an increased y
    //for each occurrence
    var prevLength: number = -1;
    var lengthStreak: number = 0;
    for (let i = 0; i < sortedArray.length; i++) {
      if (sortedArray[i] == prevLength) {
        lengthStreak++;
        if (sortedArray[i] % 2 == 0) {
          this.serverLosses.push([sortedArray[i], lengthStreak + 0.5])
        } else {
          this.serverWins.push([sortedArray[i], lengthStreak + 0.5])
        }
      } else {
        lengthStreak = 0;
        prevLength = sortedArray[i];
        if (sortedArray[i] % 2 == 0) {
          this.serverLosses.push([sortedArray[i], lengthStreak + 0.5])
        } else {
          this.serverWins.push([sortedArray[i], lengthStreak + 0.5])
        }
      }
    }
  }

  options = {
    xAxis: {
        interval: 2,
        min: 0,
        max: 100
    },
    yAxis: {
        min: 0,
        max: 20
    },
    dataZoom: [{
      type: 'slider',
      labelPrecision: 0,
      startValue: 0,
      endValue: 16
    }],
    series: [{
        symbolSize: 15,
        data: this.serverLosses,
        type: 'scatter'
    },
    {
        symbolSize: 15,
        data: this.serverWins,
        type: 'scatter',
        color: '#61a0a8'
    }]
  };

}
