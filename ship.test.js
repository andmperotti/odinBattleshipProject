import { Ship } from "./ship.js";

//test public properties of Ship class instances: length of ship, number of times they've been hit, sunk status
test("length", () => {
  expect(new Ship(3, 0, false)).toMatchObject({
    length: 3,
    hits: 0,
    sunk: false,
  });
});

//declare a ship instance for future testing
let testShip = new Ship(3, 0, false);

//test the hit method, which should increment the number of hits a ship has taken by the argument value
test("hits method", () => {
  expect(testShip.hit(1)).toMatchObject({ length: 3, hits: 1, sunk: false });
});
