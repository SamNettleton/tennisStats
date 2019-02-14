import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const STORAGE_KEY = 'savedMatches';

@Injectable({
  providedIn: 'root'
})
export class MatchStorageService {

  constructor(private storage: Storage) { }

  idExists(match) {
    this.getAllMatches();
    return this.getAllMatches().then(result => {
      console.log(result && result.indexOf(match));
      console.log(result && result.indexOf(match) !== -1);
      return result && result.indexOf(match) !== -1;
    });
  }

  storeMatch(match) {
    return this.getAllMatches().then(result => {
      if (result) {
        result.push(match);
        return this.storage.set(STORAGE_KEY, result);
      } else {
        return this.storage.set(STORAGE_KEY, [match]);
      }
    });
  }

  deleteMatch(match) {
    return this.getAllMatches().then(result => {
      if (result) {
        var index = result.indexOf(match);
        result.splice(index, 1);
        return this.storage.set(STORAGE_KEY, result);
      }
    });
  }

  getAllMatches() {
    /*this.storage.get(STORAGE_KEY)
        .then(data => {
            return data;
            console.log(data);

        });*/
    return this.storage.get(STORAGE_KEY);
  }
}
