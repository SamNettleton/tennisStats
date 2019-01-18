import { Component, OnInit } from '@angular/core';
import { MatchHistoryService } from '../matchhistory.service';
import { Match } from "src/app/match";

@Component({
  selector: 'app-track-match',
  templateUrl: './track-match.page.html',
  styleUrls: ['./track-match.page.scss'],
})
export class TrackMatchPage implements OnInit {

  public shots: string;
  public matches: Match[];
  public currentMatch: Match;
  public setScore: number[][];
  public gameScore: number[];
  public p1scoreElements: HTMLCollectionOf<Element>;
  public p2scoreElements: HTMLCollectionOf<Element>;
  constructor(private matchHistoryService: MatchHistoryService) { }

  ngOnInit() {
    this.getMatches();
    document.getElementById('p1name').innerHTML = this.currentMatch.getPlayerNames()[0];
    document.getElementById('p2name').innerHTML = this.currentMatch.getPlayerNames()[1];
    let btn = document.getElementById("submit-shots");
    btn.addEventListener("click", (e:Event) => this.addPoint());
    let increasebtn = document.getElementById("increase-shots");
    increasebtn.addEventListener("click", (e:Event) => this.increaseShots());
    this.displayServer();
  }

  getMatches(): void {
    this.matches = this.matchHistoryService.getMatches();
    this.currentMatch = this.matches[0];
  }

  increaseShots() {
    let shotCounter: HTMLElement = document.getElementById("shot-counter");
    shotCounter.innerHTML = (Number(shotCounter.innerHTML) + 1).toLocaleString();
  }

  addPoint() {
    this.currentMatch.addPoint(Number(this.shots));
    this.setScore = this.currentMatch.getSetScore();
    this.gameScore = this.currentMatch.getGameScore();
    this.p1scoreElements = document.getElementsByClassName("p1score");
    this.p2scoreElements = document.getElementsByClassName("p2score");
    //update the score of all the setScore
    this.displaySetScore();
    //set score of current game, tiebreaker, or super tiebreaker
    this.displayGameScore();
    //check server
    this.displayServer();
  }

  displaySetScore() {
    for (let i = 0; i < this.setScore[0].length; i++) {
      this.p1scoreElements[i].parentElement.style = "background-color:orange; color:black;"
      this.p2scoreElements[i].parentElement.style = "background-color:orange; color:black;"
      //set past set scores with bolded winner
      if (this.setScore[0][i] > this.setScore[1][i] && i < this.setScore[0].length - 1) {
        this.p1scoreElements[i].style = "font-weight:bold; background-color:orange; color:black;";
      } else if (i < this.setScore[0].length - 1) {
        this.p2scoreElements[i].style = "font-weight:bold; background-color:orange; color:black;";
      }
      this.p1scoreElements[i].innerHTML = this.setScore[0][i].toLocaleString();
      this.p2scoreElements[i].innerHTML = this.setScore[1][i].toLocaleString();
      this.p1scoreElements[i].parentElement.size = "1";
      this.p2scoreElements[i].parentElement.size = "1";
    }
  }

  displayGameScore() {
    //if it's in a tiebreaker
    if (this.currentMatch.getTiebreakerScore()[0] > 0 || this.currentMatch.getTiebreakerScore()[1] > 0) {
      this.p1scoreElements[this.setScore[0].length].innerHTML = this.currentMatch.getTiebreakerScore()[0].toLocaleString();
      this.p2scoreElements[this.setScore[0].length].innerHTML = this.currentMatch.getTiebreakerScore()[1].toLocaleString();
    } else if (this.currentMatch.getSuperScore()[0] > 0 || this.currentMatch.getSuperScore()[1] > 0) {
      //if it's in a super tiebreaker
      this.p1scoreElements[this.setScore[0].length].innerHTML = this.currentMatch.getSuperScore()[0].toLocaleString();
      this.p2scoreElements[this.setScore[0].length].innerHTML = this.currentMatch.getSuperScore()[1].toLocaleString();
    } else {
      //change the score formatting for games into 15, 30, 40
      var modifiedGameScores: string[] = ["0", "0"];
      for (let i = 0; i < this.gameScore.length; i++) {
        if (this.gameScore[i] == 1) {
          modifiedGameScores[i] = "15";
        } else if (this.gameScore[i] == 2) {
          modifiedGameScores[i] = "30";
        } else if (this.gameScore[i] == 3) {
          modifiedGameScores[i] = "40";
        } else {
          modifiedGameScores[i] = "0";
        }
      }
      //account for deuce games
      if (this.gameScore[0] >= 3 && this.gameScore[1] >= 3) {
        //the game is tied, back to deuce
        if (this.gameScore[0] == this.gameScore[1]) {
          modifiedGameScores = ["40", "40"];
        } else if (this.gameScore[0] > this.gameScore[1]) {
          modifiedGameScores = ["AD", "40"];
        } else {
          modifiedGameScores = ["40", "AD"];
        }
      }

      this.p1scoreElements[this.setScore[0].length].innerHTML = modifiedGameScores[0];
      this.p2scoreElements[this.setScore[0].length].innerHTML = modifiedGameScores[1];
      //this.p1scoreElements[this.setScore[0].length].parentElement.style = "background-color:white; color:black;"
      //this.p2scoreElements[this.setScore[0].length].parentElement.style = "background-color:white; color:black;"
      this.p1scoreElements[this.setScore[0].length].parentElement.size = "2";
      this.p2scoreElements[this.setScore[0].length].parentElement.size = "2";
    }

  }

  displayServer() {
    //get the current server and show a dot by their name
    let currentServer: number = this.currentMatch.getCurrentServer();
    if (currentServer == 1) {
      document.getElementById('p1serving').innerHTML = "•"
      document.getElementById('p2serving').innerHTML = ""
    } else {
      document.getElementById('p1serving').innerHTML = ""
      document.getElementById('p2serving').innerHTML = "•"
    }
  }

}
