import { Ship } from "./ship.js";

export function gameboard() {
  let sea = Array.from({ length: 10 }, () =>
    // eslint-disable-next-line prettier/prettier
    Array.from({ length: 10 }, () => 0)
  );

  let boats = [];

  //getSea returns sea for testing purposes for now
  function getSea() {
    return sea;
  }

  function receiveAttack(y, x) {
    let spotValue = sea[y][x];
    //for now this logic just checks the coordinates and changes the value accordingly or logs a statement that that position was already attacked
    if (spotValue === 0) {
      sea[y][x] = "-";
      //miss
    } else if (spotValue > 0) {
      boats[spotValue - 1].hit();
      sea[y][x] = "+";
      //hit
    } else {
      console.log("position already attacked, try again");
    }
    //later will have to add logic for ship to take damage, could instead of using just 0's and 1's, use any number > 0 to correspond to a specific boat
  }

  function placeShip(y, x, orientation, length) {
    //check for range of prospective ship length to make sure there is 1. room to fit the ship, and 2. no ship already in the prospective coordinates and length
    if (
      orientation === "up" &&
      withinSeaRange(y, x) &&
      withinSeaRange(y + length, x) &&
      vacancyChecker(y, x, orientation, length)
    ) {
      addShip(y, x, orientation, length);
    } else if (
      orientation === "down" &&
      withinSeaRange(y, x) &&
      withinSeaRange(y - length, x) &&
      vacancyChecker(y, x, orientation, length)
    ) {
      addShip(y, x, orientation, length);
    } else if (
      orientation === "right" &&
      withinSeaRange(y, x) &&
      withinSeaRange(y, x + length) &&
      vacancyChecker(y, x, orientation, length)
    ) {
      addShip(y, x, orientation, length);
    } else if (
      orientation === "left" &&
      withinSeaRange(y, x) &&
      withinSeaRange(y, x - length) &&
      vacancyChecker(y, x, orientation, length)
    ) {
      addShip(y, x, orientation, length);
    } else {
      console.log("location occupied");
    }
  }

  function withinSeaRange(y, x) {
    if (y >= 0 && y <= 9 && x >= 0 && x <= 9) {
      return true;
    } else {
      return false;
    }
  }

  function vacancyChecker(y, x, orientation, length) {
    let turn = 0;
    let wantedSpots = Array.from({ length: length }, () => {
      if (orientation === "up") {
        let prospectiveSlot = sea[y + turn][x];
        turn++;
        return prospectiveSlot;
      } else if (orientation === "down") {
        let prospectiveSlot = sea[y - turn][x];
        turn++;
        return prospectiveSlot;
      } else if (orientation === "right") {
        let prospectiveSlot = sea[y][x + turn];
        turn++;
        return prospectiveSlot;
      } else if (orientation === "left") {
        let prospectiveSlot = sea[y][x - turn];
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

  function addShip(y, x, orientation, length) {
    let turn = 0;
    boats.push(new Ship(length));
    while (turn < length) {
      if (orientation === "up") {
        sea[y + turn][x] = boats.length;
        turn++;
      } else if (orientation === "down") {
        sea[y - turn][x] = boats.length;
        turn++;
      } else if (orientation === "left") {
        sea[y][x - turn] = boats.length;
        turn++;
      } else if (orientation === "right") {
        sea[y][x + turn] = boats.length;
        turn++;
      }
    }
  }

  return { getSea, receiveAttack, placeShip };
}
