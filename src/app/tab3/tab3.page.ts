import { Component } from '@angular/core';
import { Match } from "src/app/match";
import { MatchHistoryService } from '../matchhistory.service';
import { Platform, IonList } from '@ionic/angular';

import * as echarts from 'D:/myApp/node_modules/echarts/dist/echarts';
import ECharts = echarts.ECharts;
import EChartOption = echarts.EChartOption;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public matches: Match[];
  public currentMatch: Match;
  public p2rallyLengths: number[];
  public p2serverWins: number[][] = [];
  public p2serverLosses: number[][] = [];

  constructor(private matchHistoryService: MatchHistoryService, private plt: Platform) {
    this.plt.ready().then(() => {
      this.loadItems();
    });
  }

  ngOnInit() {
  }

  loadItems() {
    this.matchHistoryService.getMatches().then(items => {
      this.matches = items;
      this.setUpView();
    });
  }

  setUpView() {
    this.setCurrentMatch();
    this.setPageTitle();
    this.p2rallyLengths = this.currentMatch.getRallyLengths(2);
    this.sortData();
    let p2statChart = echarts.init(document.getElementById('p2graph'));
    p2statChart.setOption({
      xAxis: {
          interval: 2,
          min: 0,
          max: 100,
          triggerEvent: true
      },
      yAxis: {
          min: 0,
          max: 20
      },
      legend: {
        orient: 'vertical',
        top: 10,
        data: ['Server Wins', 'Server Losses']
      },
      dataZoom: [{
        type: 'slider',
        labelPrecision: 0,
        startValue: 0,
        endValue: 16
      }],
      series: [{
          symbolSize: 15,
          name: 'Server Losses',
          data: this.p2serverLosses,
          type: 'scatter',
          color: 'black'
      },
      {
          symbolSize: 15,
          name: 'Server Wins',
          data: this.p2serverWins,
          type: 'scatter',
          color: 'orange'
      }]
    });
  }

  setCurrentMatch() {
    let rawObject: any = this.matches[this.matchHistoryService.getActive()];
    this.currentMatch = this.matchify(rawObject);
  }

  matchify(rawObject: any) {
    let matchObject: Match = new Match(rawObject.p1name, rawObject.p2name,
                                      rawObject.gamesPerSet,
                                      rawObject.sets, rawObject.server);
    matchObject.setGames(rawObject.p1games, rawObject.p2games);
    matchObject.setPoints(rawObject.p1points, rawObject.p2points);
    matchObject.setLengths(rawObject.p1lengths, rawObject.p2lengths);
    matchObject.setErrorTypes(rawObject.p1forced, rawObject.p1unforced, rawObject.p2forced, rawObject.p2unforced);
    matchObject.setServeTypes(rawObject.p1firstWon, rawObject.p1firstLost, rawObject.p1secondWon, rawObject.p1secondLost,
      rawObject.p2firstWon, rawObject.p2firstLost, rawObject.p2secondWon, rawObject.p2secondLost);
    matchObject.setNetPoints(rawObject.p1atNetWon, rawObject.p1atNetLost, rawObject.p2atNetWon, rawObject.p2atNetLost);
    matchObject.setReturns(rawObject.p1deuceReturns, rawObject.p2deuceReturns, rawObject.p1adReturns, rawObject.p2adReturns);
    return matchObject;
  }

  setPageTitle() {
    document.getElementById("p2NameTitle").innerHTML = this.currentMatch.getPlayerNames()[1] + " Serving";
  }

  getMatches(): void {
    this.currentMatch = this.matches[0];
    //this.currentMatch = this.matchHistoryService.getCurrentMatch();
  }

  sortData(): void {
    //sort the data so that it is in order
    var sortedArray: number[] = this.p2rallyLengths.sort((n1,n2) => n1 - n2);
    //loop through the data and diverge into two separate lists
    //each list will maintain the x value from rally lengths, with an increased y
    //for each occurrence
    var prevLength: number = -1;
    var lengthStreak: number = 0;
    for (let i = 0; i < sortedArray.length; i++) {
      if (sortedArray[i] == prevLength) {
        lengthStreak++;
        if (sortedArray[i] % 2 == 0) {
          this.p2serverLosses.push([sortedArray[i], lengthStreak + 0.5])
        } else {
          this.p2serverWins.push([sortedArray[i], lengthStreak + 0.5])
        }
      } else {
        lengthStreak = 0;
        prevLength = sortedArray[i];
        if (sortedArray[i] % 2 == 0) {
          this.p2serverLosses.push([sortedArray[i], lengthStreak + 0.5])
        } else {
          this.p2serverWins.push([sortedArray[i], lengthStreak + 0.5])
        }
      }
    }
  }

  optionsp2 = {
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
        data: this.p2serverLosses,
        type: 'scatter'
    },
    {
        symbolSize: 15,
        data: this.p2serverWins,
        type: 'scatter',
        color: '#61a0a8'
    }]
  };

}
