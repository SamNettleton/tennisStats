import { MatchStorageService } from './match-storage.service';

export class Match {
    p1name: string
    p2name: string
    gamesPerSet: number
    sets: number
    firstServer: number;
    public server: number = 1;
    public p1lengths: number[] = [];
    public p2lengths: number[] = [];
    public p1points: number = 0;
    public p2points: number = 0;
    public p1games: number[] = [0];
    public p2games: number[] = [0];
    public p1sets: number = 0;
    public p2sets: number = 0;
    public p1tbpoints: number = 0;
    public p2tbpoints: number = 0;
    public p1stbpoints: number = 0;
    public p2stbpoints: number = 0;
    public matchFinished: boolean = false;
    public fullThird: boolean = false;
    public statHistory: number[][] = [];
    public p1scoreHistory: number[][] = [];
    public p2scoreHistory: number[][] = [];
    public formattedScores: string[] = ["0", "0"];
    public p1formatted: string = "0";
    public p2formatted: string = "0";
    public p1forced: number = 0;
    public p1unforced: number = 0;
    public p1firstWon: number = 0;
    public p1secondWon: number = 0;
    public p1firstLost: number = 0;
    public p1secondLost: number = 0;
    public p1atNetWon: number = 0;
    public p1atNetLost: number = 0;
    public p2forced: number = 0;
    public p2unforced: number = 0;
    public p2firstWon: number = 0;
    public p2secondWon: number = 0;
    public p2firstLost: number = 0;
    public p2secondLost: number = 0;
    public p2atNetWon: number = 0;
    public p2atNetLost: number = 0;
    //first serve: [forehand, backhand], second serve: [forehand, backhand], no serve specified:...
    public p1deuceReturns: number[][] = [[0, 0], [0, 0], [0, 0]];
    public p1adReturns: number[][] = [[0, 0], [0, 0], [0, 0]];
    public p2deuceReturns: number[][] = [[0, 0], [0, 0], [0, 0]];
    public p2adReturns: number[][] = [[0, 0], [0, 0], [0, 0]];

    constructor(p1name: string, p2name: string, gamesPerSet: number, sets: number, firstServer: number) {
        this.p1name = p1name;
        this.p2name = p2name;
        this.gamesPerSet = gamesPerSet;
        this.sets = sets;
        this.server = firstServer;
        this.firstServer = firstServer;
    }

    getPlayerNames() {
      return [this.p1name, this.p2name];
    }

    getCurrentServer() {
      return this.server;
    }

    getRallyLengths(player: number) {
      if (player == 1) {
        return this.p1lengths;
      } else {
        return this.p2lengths;
      }
    }

    getErrorTypes(player: number) {
      if (player == 1) {
        return [this.p1forced.toString(), this.p1unforced.toString()];
      } else {
        return [this.p2forced.toString(), this.p2unforced.toString()];
      }
    }

    getServeStats(player: number) {
      let firstWinPercentString = '';
      let secondWinPercentString = '';
      let firstPercentString = '';
      if (player == 1) {
        if (this.p1firstWon + this.p1firstLost == 0) {
          firstWinPercentString = "N/A";
        } else {
          let firstWinPercent = (this.p1firstWon) / (this.p1firstWon + this.p1firstLost);
          firstWinPercentString = (firstWinPercent * 100).toFixed() + "%";
        }
        if (this.p1secondWon + this.p1secondLost == 0) {
          secondWinPercentString = "N/A";
        } else {
          let secondWinPercent = this.p1secondWon / (this.p1secondWon + this.p1secondLost);
          secondWinPercentString = (secondWinPercent * 100).toFixed() + "%";
        }
        if (this.p1firstWon + this.p1firstLost + this.p1secondWon + this.p1secondLost == 0) {
          firstPercentString = "N/A";
        } else {
          let firstPercent = (this.p1firstWon + this.p1firstLost) / (this.p1firstWon + this.p1firstLost + this.p1secondWon + this.p1secondLost);
          firstPercentString = (firstPercent * 100).toFixed() + "%";
        }
      } else {
        if (this.p2firstWon + this.p2firstLost == 0) {
          firstWinPercentString = "N/A";
        } else {
          let firstWinPercent = (this.p2firstWon) / (this.p2firstWon + this.p2firstLost);
          firstWinPercentString = (firstWinPercent * 100).toFixed() + "%";
        }
        if (this.p2secondWon + this.p2secondLost == 0) {
          secondWinPercentString = "N/A";
        } else {
          let secondWinPercent = this.p2secondWon / (this.p2secondWon + this.p2secondLost);
          secondWinPercentString = (secondWinPercent * 100).toFixed() + "%";
        }
        if (this.p2firstWon + this.p2firstLost + this.p2secondWon + this.p2secondLost == 0) {
          firstPercentString = "N/A";
        } else {
          let firstPercent = (this.p2firstWon + this.p2firstLost) / (this.p2firstWon + this.p2firstLost + this.p2secondWon + this.p2secondLost);
          firstPercentString = (firstPercent * 100).toFixed() + "%";
        }
      }
      return [firstWinPercentString, secondWinPercentString, firstPercentString];
    }


    getNetStats(player: number) {
      let percentage = '';
      if (player == 1) {
        if (this.p1atNetWon + this.p1atNetLost == 0) {
          let percentage = "N/A";
        } else {
          let percentageNum = this.p1atNetWon / (this.p1atNetWon + this.p1atNetLost);
          percentage = (percentageNum * 100).toFixed() + "%";
        }
        return [this.p1atNetWon.toString(), this.p1atNetLost.toString(), percentage];
      } else {
        if (this.p2atNetWon + this.p2atNetLost == 0) {
          let percentage = "N/A";
        } else {
          let percentageNum = this.p2atNetWon / (this.p2atNetWon + this.p2atNetLost);
          percentage = (percentageNum * 100).toFixed() + "%";
        }
        return [this.p2atNetWon.toString(), this.p2atNetLost.toString(), percentage];
      }
    }

    getDeuceReturnStats(player: number) {
      let all = '';
      let first = '';
      let second = '';
      if (player == 1) {
        all = (this.p1deuceReturns[0][0] + this.p1deuceReturns[1][0] + this.p1deuceReturns[2][0]).toString() + "/" + (this.p1deuceReturns[0][1] + this.p1deuceReturns[1][1] + this.p1deuceReturns[2][1]).toString();
        first = (this.p1deuceReturns[0][0]).toString() + "/" + (this.p1deuceReturns[0][1]).toString();
        second = (this.p1deuceReturns[1][0]).toString() + "/" + (this.p1deuceReturns[1][1]).toString();
      } else {
        all = (this.p2deuceReturns[0][0] + this.p2deuceReturns[1][0] + this.p2deuceReturns[2][0]).toString() + "/" + (this.p2deuceReturns[0][1] + this.p2deuceReturns[1][1] + this.p2deuceReturns[2][1]).toString();
        first = (this.p2deuceReturns[0][0]).toString() + "/" + (this.p2deuceReturns[0][1]).toString();
        second = (this.p2deuceReturns[1][0]).toString() + "/" + (this.p2deuceReturns[1][1]).toString();
      }
      return [all, first, second];
    }

    getAdReturnStats(player: number) {
      let all = '';
      let first = '';
      let second = '';
      if (player == 1) {
        all = (this.p1adReturns[0][0] + this.p1adReturns[1][0] + this.p1adReturns[2][0]).toString() + "/" + (this.p1adReturns[0][1] + this.p1adReturns[1][1] + this.p1adReturns[2][1]).toString();
        first = (this.p1adReturns[0][0]).toString() + "/" + (this.p1adReturns[0][1]).toString();
        second = (this.p1adReturns[1][0]).toString() + "/" + (this.p1adReturns[1][1]).toString();
      } else {
        all = (this.p2adReturns[0][0] + this.p2adReturns[1][0] + this.p2adReturns[2][0]).toString() + "/" + (this.p2adReturns[0][1] + this.p2adReturns[1][1] + this.p2adReturns[2][1]).toString();
        first = (this.p2adReturns[0][0]).toString() + "/" + (this.p2adReturns[0][1]).toString();
        second = (this.p2adReturns[1][0]).toString() + "/" + (this.p2adReturns[1][1]).toString();
      }
      return [all, first, second];
    }

    changeServer() {
        //if p1 is serving, change to p2, if p2 is serving, change to p1
        if (this.server == 1) {
            this.server = 2;
        } else {
            this.server = 1;
        }
    }

    addPointA(shots: number) {
        this.recordHistory(shots);
        //add the point to the lengths list of current server
        if (this.server == 1) {
            this.p1lengths.push(shots);
        } else {
            this.p2lengths.push(shots);
        }
        //give the winner of the previous point a point
        var winner: number = this.determineWinner(shots);
        this.givePoint(winner);
    }

    addPoint(shots: number, forced: number, unforced: number, firstServe: number, secondServe: number, p1atNet: number, p2atNet: number, forehandReturn: number, backhandReturn: number) {
        this.recordHistory(shots);
        //add the point to the lengths list of current server
        if (this.server == 1) {
            this.p1lengths.push(shots);
        } else {
            this.p2lengths.push(shots);
        }
        //give the winner of the previous point a point
        var winner: number = this.determineWinner(shots);
        this.updateStats(winner, forced, unforced, firstServe, secondServe, p1atNet, p2atNet, forehandReturn, backhandReturn);
        this.givePoint(winner);
    }

    updateStats(winner: number, forced: number, unforced: number, firstServe: number, secondServe: number, p1atNet: number, p2atNet: number, forehandReturn: number, backhandReturn: number) {
      if (winner == 1) {
        this.p2forced += forced;
        this.p2unforced += unforced;
        if (this.server == winner) {
          this.p1firstWon += firstServe;
          this.p1secondWon += secondServe;
        } else {
          this.p2firstLost += firstServe;
          this.p2secondLost += secondServe;
        }
        this.p1atNetWon += p1atNet;
        this.p2atNetLost += p2atNet;
      } else {
        this.p1forced += forced;
        this.p1unforced += unforced;
        if (this.server == winner) {
          this.p2firstWon += firstServe;
          this.p2secondWon += secondServe;
        } else {
          this.p1firstLost += firstServe;
          this.p1secondLost += secondServe;
        }
        this.p1atNetLost += p1atNet;
        this.p2atNetWon += p2atNet;
      }
      if (this.server == 1) {
        if ((this.p1stbpoints + this.p2stbpoints + this.p1tbpoints + this.p2tbpoints + this.p1points + this.p2points) % 2 == 0) {
          if (firstServe == 1) {
            this.p2deuceReturns[0][0] += forehandReturn;
            this.p2deuceReturns[0][1] += backhandReturn;
          } else if (secondServe == 1) {
            this.p2deuceReturns[1][0] += forehandReturn;
            this.p2deuceReturns[1][1] += backhandReturn;
          } else {
            this.p2deuceReturns[2][0] += forehandReturn;
            this.p2deuceReturns[2][1] += backhandReturn;
          }
        } else {
          if (firstServe == 1) {
            this.p2adReturns[0][0] += forehandReturn;
            this.p2adReturns[0][1] += backhandReturn;
          } else if (secondServe == 1) {
            this.p2adReturns[1][0] += forehandReturn;
            this.p2adReturns[1][1] += backhandReturn;
          } else {
            this.p2adReturns[2][0] += forehandReturn;
            this.p2adReturns[2][1] += backhandReturn;
          }
        }
      } else {
        if ((this.p1stbpoints + this.p2stbpoints + this.p1tbpoints + this.p2tbpoints + this.p1points + this.p2points) % 2 == 0) {
          if (firstServe == 1) {
            this.p1deuceReturns[0][0] += forehandReturn;
            this.p1deuceReturns[0][1] += backhandReturn;
          } else if (secondServe == 1) {
            this.p1deuceReturns[1][0] += forehandReturn;
            this.p1deuceReturns[1][1] += backhandReturn;
          } else {
            this.p1deuceReturns[2][0] += forehandReturn;
            this.p1deuceReturns[2][1] += backhandReturn;
          }
        } else {
          if (firstServe == 1) {
            this.p1adReturns[0][0] += forehandReturn;
            this.p1adReturns[0][1] += backhandReturn;
          } else if (secondServe == 1) {
            this.p1adReturns[1][0] += forehandReturn;
            this.p1adReturns[1][1] += backhandReturn;
          } else {
            this.p1adReturns[2][0] += forehandReturn;
            this.p1adReturns[2][1] += backhandReturn;
          }
        }
      }
    }

    recordHistory(shots: number) {
      //history is taken in this order:
      //0: server (1 or 2), 1: rally length
      this.statHistory.push([this.server, shots]);
      var p1currentScore: number[] = [this.p1points];
      var p2currentScore: number[] = [this.p2points];
      for (let i = 0; i < this.p1games.length; i++) {
        p1currentScore.push(this.p1games[i]);
        p2currentScore.push(this.p2games[i]);
      }
      this.p1scoreHistory.push(p1currentScore);
      this.p2scoreHistory.push(p2currentScore);
    }

    undoPoint() {
      //remove the last point stats
      if (this.statHistory[this.statHistory.length - 1][0] == 1) {
        this.p1lengths = this.p1lengths.slice(0, this.p1lengths.length - 1);
      } else {
        this.p2lengths = this.p2lengths.slice(0, this.p2lengths.length - 1);
      }
      this.statHistory = this.statHistory.slice(0, this.statHistory.length - 1);
      //remove the last point from score
      var p1newGames: number[] = [];
      var p2newGames: number[] = [];
      this.p1points = this.p1scoreHistory[this.p1scoreHistory.length - 1][0];
      this.p2points = this.p2scoreHistory[this.p2scoreHistory.length - 1][0];
      for (let i = 1; i < this.p1scoreHistory[this.p1scoreHistory.length - 1].length; i++) {
        p1newGames.push(this.p1scoreHistory[this.p1scoreHistory.length - 1][i]);
        p2newGames.push(this.p2scoreHistory[this.p2scoreHistory.length - 1][i]);
      }
      this.p1games = p1newGames;
      this.p2games = p2newGames;
      this.p1scoreHistory = this.p1scoreHistory.slice(0, this.p1scoreHistory.length - 1);
      this.p2scoreHistory = this.p2scoreHistory.slice(0, this.p2scoreHistory.length - 1);
    }

    determineWinner(shots: number) {
      let winner: number;
      if (this.server == 1) {
          if (shots % 2 == 0) {
              winner = 2;
          } else {
              //p1 won, decide point type
              winner = 1;
          }
      } else {
          if (shots % 2 == 0) {
              //p1 won, decide point type
              winner = 1;
          } else {
              winner = 2;
          }
      }
      return winner;
    }

    givePoint(winner: number) {
        //gives the winner of the previous point a point in either their game score, tiebreaker, or super tiebreaker

        //determine point type based on breakers
        if (this.p1games[this.p1games.length-(this.p1sets + this.p2sets)-1] == this.gamesPerSet && this.p2games[this.p2games.length-(this.p1sets + this.p2sets)-1] == this.gamesPerSet) {
            //regular tiebreaker
            if (winner == 1) {
              this.p1tbpoints++;
            } else {
              this.p2tbpoints++;
            }
            //change server if total points are odd
            if ((this.p1tbpoints + this.p2tbpoints) % 2 == 1) {
                this.changeServer();
            }
        } else if (this.p1sets == 1 && this.p2sets == 1 && this.fullThird == false) {
            //super tiebreaker
            if (winner == 1) {
              this.p1stbpoints++;
            } else {
              this.p2stbpoints++;
            }
            //change server if total points are odd
            if ((this.p1stbpoints + this.p2stbpoints) % 2 == 1) {
                this.changeServer();
            }
        } else {
            //normal game
            if (winner == 1) {
              this.p1points++;
            } else {
              this.p2points++;
            }
        }
        //check points to see if a player won a game, set, or match
        this.checkPoints();
        //format the score so that it can be easily exported
        this.formatGameScore();
    }

    takePoint(player: number) {
      if (this.p1games[this.p1games.length-(this.p1sets + this.p2sets)-1] == this.gamesPerSet && this.p2games[this.p2games.length-(this.p1sets + this.p2sets)-1] == this.gamesPerSet) {
          //regular tiebreaker
          if (player == 1 && this.p1tbpoints > 0) {
            this.p1tbpoints--;
          } else if (this.p2tbpoints > 0) {
            this.p2tbpoints--;
          }
          //change server if total points are odd
          if ((this.p1tbpoints + this.p2tbpoints) % 2 == 1) {
              this.changeServer();
          }
      } else if (this.p1sets == 1 && this.p2sets == 1 && this.fullThird == false) {
          //super tiebreaker
          if (player == 1 && this.p1stbpoints > 0) {
            this.p1stbpoints--;
          } else if (this.p2stbpoints > 0) {
            this.p2stbpoints--;
          }
          //change server if total points are odd
          if ((this.p1stbpoints + this.p2stbpoints) % 2 == 1) {
              this.changeServer();
          }
      } else {
          //normal game
          if (player == 1 && this.p1points > 0) {
            this.p1points--;
          } else if (this.p2points > 0) {
            this.p2points--;
          }
      }
    }

    checkPoints() {
        if ((this.p1points >= 4) && (this.p1points - this.p2points >= 2)) {
            //if p1 has 4 or more points and has >= 2 more points than p2
            this.p1points = 0;
            this.p2points = 0;
            this.changeServer();
            this.p1games[this.p1games.length - 1]++;
        } else if ((this.p2points >= 4) && (this.p2points - this.p1points >= 2)) {
            //if p2 has 4 or more points and has >= 2 more points than p1
            this.p1points = 0;
            this.p2points = 0;
            this.changeServer();
            this.p2games[this.p2games.length - 1]++;
        }

        //handle breakers
        if (this.p1tbpoints >= 7 && this.p1tbpoints - this.p2tbpoints > 1) {
            //if p1 won a tiebreaker
            this.p1tbpoints = 0;
            this.p2tbpoints = 0;
            this.p1games[this.p1games.length - 1]++;
            if (this.server == this.firstServer ) {
                this.changeServer();
            }
        } else if (this.p2tbpoints >= 7 && this.p2tbpoints - this.p1tbpoints > 1) {
            //if p2 won a tiebreaker
            this.p1tbpoints = 0;
            this.p2tbpoints = 0;
            this.p2games[this.p2games.length - 1]++;
            if (this.server == this.firstServer ) {
                this.changeServer();
            }
        }

        //handle SUPER breakers
        if (this.p1stbpoints >= 10 && this.p1stbpoints - this.p2stbpoints > 1) {
          //if p1 won a super tiebreaker
          this.p1games[this.p1games.length - 1]++;
        } else if (this.p2stbpoints >= 10 && this.p2stbpoints - this.p1stbpoints > 1) {
          //if p2 won a super tiebreaker
          this.p2games[this.p2games.length - 1]++;
        }

        //handle and of set
        this.checkSet();
    }

    checkSet() {
      if (this.p1games[this.p1games.length-1] == this.gamesPerSet && this.p2games[this.p2games.length-1] < this.gamesPerSet - 1 || this.p1games[this.p1games.length-1] == this.gamesPerSet + 1) {
          //if p1 has 6 games and p2 has less than 5, or if p1 has 7 games
          this.p1games.push(0);
          this.p2games.push(0);
          this.p1sets++;
      } else if (this.p2games[this.p2games.length-1] == this.gamesPerSet && this.p1games[this.p1games.length-1] < this.gamesPerSet - 1 || this.p2games[this.p2games.length-1] == this.gamesPerSet + 1) {
          //if p2 has 6 games and p1 has less than 5, or if p2 has 7 games
          this.p1games.push(0);
          this.p2games.push(0);
          this.p2sets++;
      }
    }

    addGame(player: number, set: number) {
      if (player == 1) {
        this.p1games[set]++;
      } else {
        this.p2games[set]++;
      }
      this.checkSet();
    }

    subtractGame(player:number, set: number) {

      if (player == 1) {
        this.p1games[set]--;
        if (this.p1games[set] < 0) {
          this.p1games.splice(set, 1);
          this.p2games.splice(set, 1);
        }
      } else {
        this.p2games[set]--;
        if (this.p2games[set] < 0) {
          this.p1games.splice(set, 1);
          this.p2games.splice(set, 1);
        }
      }
    }

    formatGameScore() {
      //if it's in a tiebreaker
      if (this.getTiebreakerScore()[0] > 0 || this.getTiebreakerScore()[1] > 0) {
        this.formattedScores = [this.getTiebreakerScore()[0].toLocaleString(),
                                this.getTiebreakerScore()[1].toLocaleString()]
      } else if (this.getSuperScore()[0] > 0 || this.getSuperScore()[1] > 0) {
        //if it's in a super tiebreaker
        this.formattedScores = [this.getSuperScore()[0].toLocaleString(),
                                this.getSuperScore()[1].toLocaleString()]
      } else {
        //change the score formatting for games into 15, 30, 40
        var modifiedGameScores: string[] = ["0", "0"];
        var gameScore: Number[] = this.getGameScore();
        for (let i = 0; i < gameScore.length; i++) {
          if (gameScore[i] == 1) {
            this.formattedScores[i] = "15";
          } else if (gameScore[i] == 2) {
            this.formattedScores[i] = "30";
          } else if (gameScore[i] == 3) {
            this.formattedScores[i] = "40";
          } else {
            this.formattedScores[i] = "0";
          }
        }
        //account for deuce games
        if (gameScore[0] >= 3 && gameScore[1] >= 3) {
          //the game is tied, back to deuce
          if (gameScore[0] == gameScore[1]) {
            this.formattedScores = ["40", "40"];
          } else if (gameScore[0] > gameScore[1]) {
            this.formattedScores = ["AD", "40"];
          } else {
            this.formattedScores = ["40", "AD"];
          }
        }
      this.p1formatted = this.formattedScores[0];
      this.p2formatted = this.formattedScores[1];
    }
  }

  setGames(p1games: number[], p2games: number[]) {
      this.p1games = p1games;
      this.p2games = p2games;
  }

  setPoints(p1points: number, p2points: number) {
    this.p1points = p1points;
    this.p2points = p2points;
  }

  setLengths(p1lengths: number[], p2lengths: number[]) {
    this.p1lengths = p1lengths;
    this.p2lengths = p2lengths;
  }

  setErrorTypes(p1forced: number, p1unforced: number, p2forced: number, p2unforced: number) {
    this.p1forced = p1forced;
    this.p1unforced = p1unforced;
    this.p2forced = p2forced;
    this.p2unforced = p2unforced;
  }

  setServeTypes(p1firstWon: number, p1firstLost: number, p1secondWon: number, p1secondLost: number, p2firstWon: number, p2firstLost: number, p2secondWon: number, p2secondLost: number) {
    this.p1firstWon = p1firstWon;
    this.p1firstLost = p1firstLost;
    this.p1secondWon = p1secondWon;
    this.p1secondLost = p1secondLost;
    this.p2firstWon = p2firstWon;
    this.p2firstLost = p2firstLost;
    this.p2secondWon = p2secondWon;
    this.p2secondLost = p2secondLost;
  }

  setNetPoints(p1atNetWon: number, p1atNetLost: number, p2atNetWon: number, p2atNetLost: number) {
    this.p1atNetWon = p1atNetWon;
    this.p1atNetLost = p1atNetLost;
    this.p2atNetWon = p2atNetWon;
    this.p2atNetLost = p2atNetLost;
  }

  setReturns(p1deuceReturns: number[][], p2deuceReturns: number[][], p1adReturns: number[][], p2adReturns: number[][]) {
    this.p1deuceReturns = p1deuceReturns;
    this.p2deuceReturns = p2deuceReturns;
    this.p1adReturns = p1adReturns;
    this.p2adReturns = p2adReturns;
  }

  setServer(server: number) {
    this.server = server;
  }

  increasePoint(player: number) {

  }

    getSetScore() {
      //returns the current score of each set
      return [this.p1games, this.p2games];
    }

    getGameScore() {
      //returns the current game score
      return [this.p1points, this.p2points];
    }

    getTiebreakerScore() {
      //retruns the current tiebreaker score
      return [this.p1tbpoints, this.p2tbpoints];
    }

    getSuperScore() {
      //retruns the current super tiebreaker score
      return [this.p1stbpoints, this.p2stbpoints];
    }

}
