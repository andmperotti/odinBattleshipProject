import { Ship } from "./ship.js";

export class Gameboard {
  constructor() {}
  _boats = Array.from({ length: 5 }, () => "");

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
    let spotValue = this._sea[y][x];
    //for now this logic just checks the coordinates and changes the value accordingly or logs a statement that that position was already attacked
    if (spotValue === 0) {
      this._sea[y][x] = "-";
      //miss
      this._misses++;
    } else if (spotValue > 0) {
      this._boats[spotValue - 1].hit();
      this._sea[y][x] = "+";
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
      this._withinSeaRange(y - (length - 1), x) &&
      this._vacancyChecker(y, x, orientation, length)
    ) {
      this._addShip(y, x, orientation, length, type);
    } else if (
      orientation === "down" &&
      this._withinSeaRange(y, x) &&
      this._withinSeaRange(y + (length - 1), x) &&
      this._vacancyChecker(y, x, orientation, length)
    ) {
      this._addShip(y, x, orientation, length, type);
    } else if (
      orientation === "right" &&
      this._withinSeaRange(y, x) &&
      this._withinSeaRange(y, x + (length - 1)) &&
      this._vacancyChecker(y, x, orientation, length)
    ) {
      this._addShip(y, x, orientation, length, type);
    } else if (
      orientation === "left" &&
      this._withinSeaRange(y, x) &&
      this._withinSeaRange(y, x - (length - 1)) &&
      this._vacancyChecker(y, x, orientation, length)
    ) {
      this._addShip(y, x, orientation, length, type);
    } else {
      //return error message to be displayed on place ships screen under specific element related to error being created, and yes this isn't an error object
      return "location occupied or out of range, or type of ship has been placed";
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
        let prospectiveSlot = this._sea[y - turn][x];
        turn++;
        return prospectiveSlot;
      } else if (orientation === "down") {
        let prospectiveSlot = this._sea[y + turn][x];
        turn++;
        return prospectiveSlot;
      } else if (orientation === "right") {
        let prospectiveSlot = this._sea[y][x + turn];
        turn++;
        return prospectiveSlot;
      } else if (orientation === "left") {
        let prospectiveSlot = this._sea[y][x - turn];
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
    //depending on the type of the ship it will be added to _boats in a specific index
    switch (type) {
      case "carrier":
        this.boats[0] = new Ship(5, "carrier");
        break;
      case "battleship":
        this.boats[1] = new Ship(4, "battleship");
        break;
      case "destroyer":
        this.boats[2] = new Ship(3, "destroyer");
        break;
      case "submarine":
        this.boats[3] = new Ship(3, "submarine");
        break;
      case "patrol boat":
        this.boats[4] = new Ship(2, "patrol boat");
        break;
    }
    //variable to help us keep track of how many spots to take up for length of each ship
    let counter = 0;
    //add to ship to sea ... in an incrementing fashion
    while (counter < length) {
      if (orientation === "up") {
        this._sea[y - counter][x] =
          this._boats.findIndex((boat) => boat.type === type) + 1;
        counter++;
      } else if (orientation === "down") {
        this._sea[y + counter][x] =
          this._boats.findIndex((boat) => boat.type === type) + 1;
        counter++;
      } else if (orientation === "left") {
        this._sea[y][x - counter] =
          this._boats.findIndex((boat) => boat.type === type) + 1;
        counter++;
      } else if (orientation === "right") {
        this._sea[y][x + counter] =
          this._boats.findIndex((boat) => boat.type === type) + 1;
        counter++;
      }
    }
  }

  boatsRemaining() {
    return this._boats.filter((boat) => boat.sunk === false).length;
  }

  replaceShip(type, newY, newX, newOrientation) {
    //type is partly how we choose between ships, when it comes down to replacing destroyer or submarine the order of boats in the array helps us because destroyer always precedes submarine
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
    //temporary variable to hold old boats details, in case new boat won't fit where user is trying to place it, and old sea for if prospective new boat doesn't fit we can revert sea to previous state
    let oldBoats = structuredClone(this._boats);
    let oldSea = this._sea.slice();

    //find the specific preexisting boat in the boats array that will be replaced with this new boat
    let targetedBoatIndex = this._boats.findIndex((boat) => boat.type === type);
    //variable to store the value which represents the boat in the sea spots
    let targetedBoatValue = targetedBoatIndex + 1;

    //remove old boat data from _boats
    this._boats[targetedBoatIndex] = "";

    //wipe the sea of that old boat, use targetedBoatValue because index in the boats does not match natively with the value we use for the boats in the logic
    this._sea = this._sea.map((row) =>
      row.map(
        (spot) =>
          // eslint-disable-next-line prettier/prettier
          spot === targetedBoatValue ? 0 : spot
        // eslint-disable-next-line prettier/prettier
      )
    );

    if (
      //if boat passes vacancy checker of new position, and if it's within sea range...
      this._vacancyChecker(newY, newX, newOrientation, length) &&
      this._withinSeaRange(newY, newX)
    ) {
      //replace empty placeholder string in array with this new boat
      this._boats[targetedBoatIndex] = new Ship(length, type);
      //place new boat into sea using index of boat in boats array +1
      let counter = 0;
      while (counter < length) {
        if (newOrientation === "up") {
          this._sea[newY + counter][newX] = targetedBoatValue;
        } else if (newOrientation === "down") {
          this._sea[newY - counter][newX] = targetedBoatValue;
        } else if (newOrientation === "left") {
          this._sea[newY][newX - counter] = targetedBoatValue;
        } else if (newOrientation === "right") {
          this._sea[newY][newX + counter] = targetedBoatValue;
          counter++;
        }
      }
    } else {
      //boat cant be placed at new position
      //replace current boats with old boats
      this._boats = structuredClone(oldBoats);
      //revert sea
      this._sea = oldSea.slice();

      //some kind of error or return here
      return false;
    }
  }

  clearShips() {
    this._boats = Array.from({ length: 5 }, () => "");
    this._sea = Array.from({ length: 10 }, () =>
      // eslint-disable-next-line prettier/prettier
      Array.from({ length: 10 }, () => 0)
    );
  }
}
