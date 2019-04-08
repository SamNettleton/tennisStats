import { Component, OnInit } from '@angular/core';
import { Match } from "src/app/match";
import { Storage } from '@ionic/storage';
import { MatchHistoryService } from '../../matchhistory.service';
import { Platform, ModalController, NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-score-popover',
  templateUrl: './score-popover.component.html',
  styleUrls: ['./score-popover.component.scss']
})
export class ScorePopoverComponent implements OnInit {

  public currentMatch: Match;
  public matches: Match[];
  public setScore: number[][];
  public gameScore: number[];
  public p1scoreElements: HTMLElement[];
  public p2scoreElements: HTMLElement[];

  constructor( private popoverController: PopoverController, private matchHistoryService: MatchHistoryService, private modalController: ModalController, private navParams: NavParams ) {
  }

  ngOnInit() {
    console.table(this.navParams);
    this.currentMatch = this.navParams.data.currentMatch;
    this.matches = this.navParams.data.matchList;
    this.p1scoreElements = this.getElements('pp1score');
    this.p2scoreElements = this.getElements('pp2score');
    this.displayScores();
    let btnCancel = document.getElementById("btncancel");
    btnCancel.addEventListener("click", (e:Event) => this.cancelChanges());
    let btnSave = document.getElementById("btnsave");
    btnSave.addEventListener("click", (e:Event) => this.saveChanges());
  }

  getElements(initialText: String) {
    var htmlElements: HTMLElement[] = [];
    for (let i = 0; i < 6; i++) {
      htmlElements.push(document.getElementById(initialText + i.toLocaleString()));
    }
    return htmlElements;
  }

  increaseGame(index: number, player: String) {
    this.currentMatch.addGame(Number(player), index);
    this.doRefresh();
    this.p1scoreElements = this.getElements('pp1score');
    this.p2scoreElements = this.getElements('pp2score');
    this.displayScores();
  }

  decreaseGame(index: number, player: String) {
    this.currentMatch.subtractGame(Number(player), index);
    this.doRefresh();
    this.p1scoreElements = this.getElements('pp1score');
    this.p2scoreElements = this.getElements('pp2score');
    this.displayScores();
  }

  increasePoint(player: String) {
    this.currentMatch.givePoint(Number(player));
    this.doRefresh();
    this.p1scoreElements = this.getElements('pp1score');
    this.p2scoreElements = this.getElements('pp2score');
    this.displayScores();
  }

  decreasePoint(player: String) {
    this.currentMatch.takePoint(Number(player));
    this.doRefresh();
    this.p1scoreElements = this.getElements('pp1score');
    this.p2scoreElements = this.getElements('pp2score');
    this.displayScores();
  }

  changeServer(server: String) {
    let p1serverElement = document.getElementById("p1servingRadio");
    let p2serverElement = document.getElementById("p2servingRadio");
    if (server == '1') {
      p1serverElement.innerHTML = '<ion-icon name="radio-button-on"></ion-icon>';
      p2serverElement.innerHTML = '<ion-icon name="radio-button-off"></ion-icon>';
    } else {
      p1serverElement.innerHTML = '<ion-icon name="radio-button-off"></ion-icon>';
      p2serverElement.innerHTML = '<ion-icon name="radio-button-on"></ion-icon>';
    }
    this.currentMatch.setServer(Number(server));
  }

  doRefresh() {
    setTimeout(() => {
    }, 2000);
  }

  displayScores() {
    this.setScore = this.currentMatch.getSetScore();
    this.gameScore = this.currentMatch.getGameScore();
    this.p1scoreElements = this.getElements('pp1score');
    this.p2scoreElements = this.getElements('pp2score');
    //update the score of all the setScore
    this.displaySetScore();
    //set score of current game, tiebreaker, or super tiebreaker
    this.displayGameScore();
    //make sure formatting is blank after other sets (in case removed set)
    this.updateNoneScore();
  }

  displaySetScore() {
    for (let i = 0; i < this.setScore[0].length; i++) {
      this.p1scoreElements[i].classList.remove("game-score");
      this.p2scoreElements[i].classList.remove("game-score");
      //set past set scores with bolded winner
      if (this.setScore[0][i] > this.setScore[1][i] && i < this.setScore[0].length - 1) {
        this.p1scoreElements[i].style.fontWeight = 'bold';
        this.p2scoreElements[i].style.fontWeight = 'normal';
      } else if (i < this.setScore[0].length - 1) {
        this.p1scoreElements[i].style.fontWeight = 'normal';
        this.p2scoreElements[i].style.fontWeight = 'bold';
      }
      let p1SetScoreElement = <HTMLElement> this.p1scoreElements[i].childNodes[0];
      let p2SetScoreElement = <HTMLElement> this.p2scoreElements[i].childNodes[0];
      p1SetScoreElement.innerHTML = this.setScore[0][i].toLocaleString();
      p2SetScoreElement.innerHTML = this.setScore[1][i].toLocaleString();
      //this.p1scoreElements[i].innerHTML = this.setScore[0][i].toLocaleString();
      //this.p2scoreElements[i].innerHTML = this.setScore[1][i].toLocaleString();
      this.p1scoreElements[i].classList.add("set-score");
      this.p2scoreElements[i].classList.add("set-score");
    }
  }

  displayGameScore() {
    let p1GameScoreElement = <HTMLElement> this.p1scoreElements[this.setScore[0].length].childNodes[0];
    let p2GameScoreElement = <HTMLElement> this.p2scoreElements[this.setScore[0].length].childNodes[0];
    //if it's in a tiebreaker
    if (this.currentMatch.getTiebreakerScore()[0] > 0 || this.currentMatch.getTiebreakerScore()[1] > 0) {
      p1GameScoreElement.innerHTML = this.currentMatch.getTiebreakerScore()[0].toLocaleString();
      p2GameScoreElement.innerHTML = this.currentMatch.getTiebreakerScore()[1].toLocaleString();
    } else if (this.currentMatch.getSuperScore()[0] > 0 || this.currentMatch.getSuperScore()[1] > 0) {
      //if it's in a super tiebreaker
      p1GameScoreElement.innerHTML = this.currentMatch.getSuperScore()[0].toLocaleString();
      p2GameScoreElement.innerHTML = this.currentMatch.getSuperScore()[1].toLocaleString();
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

      p1GameScoreElement.innerHTML = modifiedGameScores[0];
      p2GameScoreElement.innerHTML = modifiedGameScores[1];
      this.p1scoreElements[this.setScore[0].length].classList.remove("none-score");
      this.p2scoreElements[this.setScore[0].length].classList.remove("none-score");
      this.p1scoreElements[this.setScore[0].length].classList.remove("set-score");
      this.p2scoreElements[this.setScore[0].length].classList.remove("set-score");
      this.p1scoreElements[this.setScore[0].length].classList.add("game-score");
      this.p2scoreElements[this.setScore[0].length].classList.add("game-score");
    }
  }

  updateNoneScore() {
    for (let i = this.setScore[0].length + 1; i < this.p1scoreElements.length; i++) {
      this.p1scoreElements[i].classList.remove("game-score");
      this.p2scoreElements[i].classList.remove("game-score");
      this.p1scoreElements[i].classList.remove("set-score");
      this.p2scoreElements[i].classList.remove("set-score");
      this.p1scoreElements[i].classList.add("none-score");
      this.p2scoreElements[i].classList.add("none-score");
      this.p1scoreElements[i].innerHTML = "<div></div>";
      this.p2scoreElements[i].innerHTML = "<div></div>";
      this.p1scoreElements[i].style.fontWeight = 'normal';
      this.p2scoreElements[i].style.fontWeight = 'normal';
    }
  }

  saveChanges() {
    this.updateStorage();
    this.dismissClick();
  }

  cancelChanges() {
    this.dismissClick();
  }

  async dismissClick() {
    await this.popoverController.dismiss();
  }

  updateStorage() {
    this.matches[this.matchHistoryService.getActive()] = this.currentMatch;
    this.matchHistoryService.updateStorage(this.matches);
  }

}
