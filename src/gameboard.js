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

  placeShip(y, x, orientation, length, type) {
    //check for range of prospective ship length to make sure there is 1. room to fit the ship, and 2. no ship already in the prospective coordinates and length
    if (
      orientation === "up" &&
      this._withinSeaRange(y, x) &&
      this._withinSeaRange(y + length, x) &&
      this._vacancyChecker(y, x, orientation, length)
    ) {
      this._addShip(y, x, orientation, length, type);
    } else if (
      orientation === "down" &&
      this._withinSeaRange(y, x) &&
      this._withinSeaRange(y - length, x) &&
      this._vacancyChecker(y, x, orientation, length)
    ) {
      this._addShip(y, x, orientation, length, type);
    } else if (
      orientation === "right" &&
      this._withinSeaRange(y, x) &&
      this._withinSeaRange(y, x + length) &&
      this._vacancyChecker(y, x, orientation, length)
    ) {
      this._addShip(y, x, orientation, length, type);
    } else if (
      orientation === "left" &&
      this._withinSeaRange(y, x) &&
      this._withinSeaRange(y, x - length) &&
      this._vacancyChecker(y, x, orientation, length)
    ) {
      this._addShip(y, x, orientation, length, type);
    } else {
      //return error message to be displayed on place ships screen under specific element related to error being created, and yes this isn't an error object
      return "location occupied or out of range";
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

  _addShip(y, x, orientation, length, type) {
    //variable to help us keep track of how many spots to take up for length of each ship
    let counter = 0;
    this._boats.push(new Ship(length, type));
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

  replaceShip(type, y, x, orientation) {
    let length =
      type === "carrier"
        ? 5
        : type === "battleship"
          ? 4
          : type === "destroyer"
            ? 3
            : type === "submarine"
              ? 3
              : type === "patrol boat"
                ? 2
                : null;

    //find the specific boat in the boats array
    let targetedBoat = this._boats.findIndex((boat) => (boat.type = "type"));
    //remove it
    this._boats = this._boats
      .slice(0, targetedBoat)
      .concat(this._boats.slice(targetedBoat));
    //replace it with new boat of same type
    this.placeShip(y, x, orientation, length, type);
  }

  clearShips() {
    this._boats = [];
  }
}
