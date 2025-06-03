import { Ship } from "./ship.js";

//test public properties of Ship class instances: length of ship, number of times they've been hit, sunk status
test("length", () => {
  expect(new Ship(3, 0, false)).toMatchObject({
    length: 3,
    hits: 0,
    sunk: false,
  });
});
