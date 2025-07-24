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
    }
    //later will have to add logic for ship to take damage, could instead of using just 0's and 1's, use any number > 0 to correspond to a specific boat
  }

  placeShip(y, x, orientation, length, type) {
    //check for range of prospective ship length to make sure there is 1. room to fit the ship, and 2. no ship already in the prospective coordinates and length
    if (
      this.withinSeaRange(y, x, orientation, length) &&
      this.vacancyChecker(y, x, orientation, length)
    ) {
      this._addShip(y, x, orientation, length, type);
    }
  }

  withinSeaRange(y, x, orientation, length) {
    let counter = 0;
    while (counter < length) {
      let currentY = y;
      let currentX = x;
      if (orientation === "up") {
        currentY = y - counter;
      } else if (orientation === "down") {
        currentY = y + counter;
      } else if (orientation === "left") {
        currentX = x - counter;
      } else if (orientation === "right") {
        currentX = x + counter;
      }
      if (currentY < 0 || currentY > 9 || currentX < 0 || currentX > 9) {
        return false;
      }
      counter++;
    }
    return true;
  }

  vacancyChecker(y, x, orientation, length) {
    //set up variables to represent each progressing sea spot's y and x coordinates
    let currentY = y;
    let currentX = x;
    //iterate until a temp variable is equal to the length argument value, each iteration changing the y and x coordiante to correct next sea spot and checking if that sea spot is occupied by another ship or not.
    for (let i = 0; i < length; i++) {
      if (orientation === "up") {
        currentY = y - i;
      } else if (orientation === "down") {
        currentY = y + i;
      } else if (orientation === "left") {
        currentX = x - i;
      } else if (orientation === "right") {
        currentX = x + i;
      }
      //check if the prospective sea spot is occupied
      if (this._sea[currentY][currentX] !== 0) {
        return false;
      }
    }
    //finally return true if the above looop did not find occupied sea spots in the desired range
    return true;
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
    //add ship to sea spots ... in an incrementing fashion, aka first of the length, then second, etc until the last is placed
    while (counter < length) {
      if (orientation === "up") {
        this._sea[y - counter][x] =
          this._boats.findIndex((boat) => boat.type === type) + 1;
      } else if (orientation === "down") {
        this._sea[y + counter][x] =
          this._boats.findIndex((boat) => boat.type === type) + 1;
      } else if (orientation === "left") {
        this._sea[y][x - counter] =
          this._boats.findIndex((boat) => boat.type === type) + 1;
      } else if (orientation === "right") {
        this._sea[y][x + counter] =
          this._boats.findIndex((boat) => boat.type === type) + 1;
      }
      counter++;
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
      //if boat passes vacancy checker of new position, and if it's within sea range... then add it to the sea and boats arrays
      this.withinSeaRange(newY, newX, newOrientation, length) &&
      this.vacancyChecker(newY, newX, newOrientation, length)
    ) {
      //replace empty placeholder string in array with this new boat
      this._boats[targetedBoatIndex] = new Ship(length, type);
      //place new boat into sea using index of boat in boats array +1
      let counter = 0;
      while (counter < length) {
        if (newOrientation === "up") {
          this._sea[newY - counter][newX] = targetedBoatValue;
        } else if (newOrientation === "down") {
          this._sea[newY + counter][newX] = targetedBoatValue;
        } else if (newOrientation === "left") {
          this._sea[newY][newX - counter] = targetedBoatValue;
        } else if (newOrientation === "right") {
          this._sea[newY][newX + counter] = targetedBoatValue;
        }
        counter++;
      }
    } else {
      //boat cant be placed at new position
      //replace current boats with old boats
      this._boats = structuredClone(oldBoats);
      //revert sea
      this._sea = oldSea.slice();
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
