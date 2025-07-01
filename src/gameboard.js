import { Ship } from "./ship.js";

export class Gameboard {
  constructor() {}
  _boats = [];

  get boats() {
    return this._boats;
  }

  _isGameboardInstance = true;

  get isGameboardInstance() {
    return this._isGameboardInstance;
  }

  _sea = Array.from({ length: 10 }, () =>
    // eslint-disable-next-line prettier/prettier
    Array.from({ length: 10 }, () => 0)
  );

  get sea() {
    return this._sea;
  }

  _misses = 0;

  get misses() {
    return this._misses;
  }

  receiveAttack(y, x) {
    let spotValue = this.sea[y][x];
    //for now this logic just checks the coordinates and changes the value accordingly or logs a statement that that position was already attacked
    if (spotValue === 0) {
      this.sea[y][x] = "-";
      //miss
      this._misses++;
    } else if (spotValue > 0) {
      this._boats[spotValue - 1].hit();
      this.sea[y][x] = "+";
      //hit
    } else {
      console.log("position already attacked, try again");
    }
    //later will have to add logic for ship to take damage, could instead of using just 0's and 1's, use any number > 0 to correspond to a specific boat
  }

  placeShip(y, x, orientation, length) {
    //check for range of prospective ship length to make sure there is 1. room to fit the ship, and 2. no ship already in the prospective coordinates and length
    if (
      orientation === "up" &&
      this._withinSeaRange(y, x) &&
      this._withinSeaRange(y + length, x) &&
      this._vacancyChecker(y, x, orientation, length)
    ) {
      this._addShip(y, x, orientation, length);
    } else if (
      orientation === "down" &&
      this._withinSeaRange(y, x) &&
      this._withinSeaRange(y - length, x) &&
      this._vacancyChecker(y, x, orientation, length)
    ) {
      this._addShip(y, x, orientation, length);
    } else if (
      orientation === "right" &&
      this._withinSeaRange(y, x) &&
      this._withinSeaRange(y, x + length) &&
      this._vacancyChecker(y, x, orientation, length)
    ) {
      this._addShip(y, x, orientation, length);
    } else if (
      orientation === "left" &&
      this._withinSeaRange(y, x) &&
      this._withinSeaRange(y, x - length) &&
      this._vacancyChecker(y, x, orientation, length)
    ) {
      this._addShip(y, x, orientation, length);
    } else {
      console.log("location occupied");
    }
  }

  _withinSeaRange(y, x) {
    if (y >= 0 && y <= 9 && x >= 0 && x <= 9) {
      return true;
    } else {
      return false;
    }
  }

  _vacancyChecker(y, x, orientation, length) {
    let turn = 0;
    let wantedSpots = Array.from({ length: length }, () => {
      if (orientation === "up") {
        let prospectiveSlot = this.sea[y + turn][x];
        turn++;
        return prospectiveSlot;
      } else if (orientation === "down") {
        let prospectiveSlot = this.sea[y - turn][x];
        turn++;
        return prospectiveSlot;
      } else if (orientation === "right") {
        let prospectiveSlot = this.sea[y][x + turn];
        turn++;
        return prospectiveSlot;
      } else if (orientation === "left") {
        let prospectiveSlot = this.sea[y][x - turn];
        turn++;
        return prospectiveSlot;
      }
    });
    if (wantedSpots.every((spot) => spot === 0)) {
      return true;
    } else {
      return false;
    }
  }

  _addShip(y, x, orientation, length) {
    //variable to help us keep track of how many spots to take up for length of each ship
    let counter = 0;
    this._boats.push(new Ship(length));
    while (counter < length) {
      if (orientation === "up") {
        this.sea[y + counter][x] = this._boats.length;
        counter++;
      } else if (orientation === "down") {
        this.sea[y - counter][x] = this._boats.length;
        counter++;
      } else if (orientation === "left") {
        this.sea[y][x - counter] = this._boats.length;
        counter++;
      } else if (orientation === "right") {
        this.sea[y][x + counter] = this._boats.length;
        counter++;
      }
    }
  }

  boatsRemaining() {
    return this._boats.filter((boat) => !boat.sunk).length;
  }
}
