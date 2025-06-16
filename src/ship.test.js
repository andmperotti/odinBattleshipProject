import { describe, expect, test } from "@jest/globals";
import { Ship } from "./ship.js";

//test public properties of Ship class instances: length of ship, number of times they've been hit, sunk status (should be false)
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
  testShip.hit();
  expect(testShip).toMatchObject({ length: 3, hits: 1, sunk: false });
});

//simulate the ship getting hit three times
//then test functionality of isSunk again, should be sunk
test("ship sinks", () => {
  let testShip = new Ship(3);
  testShip.hit();
  testShip.hit();
  testShip.hit();

  expect(testShip).toMatchObject({ length: 3, hits: 3, sunk: true });
});
