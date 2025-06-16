import { describe, expect, test } from "@jest/globals";
import { Ship } from "./ship.js";

//test public properties of Ship class instances: length of ship, number of times they've been hit, sunk status
test("length", () => {
  expect(new Ship(3)).toMatchObject({
    length: 3,
    hits: 0,
    sunk: false,
  });
});

//test the hit method, which should increment the number of hits a ship has taken by the argument value
test("hits method", () => {
  let testShip = new Ship(3);
  expect(testShip.hit(1)).toMatchObject({ length: 3, hits: 1, sunk: false });
});

//test the isSunk method, which considers the length of the ship and how many hits it has taken which it either changes the ship to be sunk or I'm guessing logs somewhere that the ship has not sunk
test("isSunk method", () => {
  let testShip = new Ship(3);
  testShip.isSunk();
  expect(testShip).toMatchObject({ length: 3, hits: 0, sunk: false });
});

//simulate the ship getting hit three times
//then test functionality of isSunk again, should be sunk
test("isSunk method", () => {
  let testShip = new Ship(3);
  testShip.hit(3);
  testShip.isSunk();
  expect(testShip).toMatchObject({ length: 3, hits: 3, sunk: true });
});
