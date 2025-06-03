import { ship } from "./ship.js";

export function gameboard() {
  let sea = Array.from({ length: 10 }, (sub) =>
    Array.from({ length: 10 }, (element) => 0)
  );
  function getSea() {
    return sea;
  }

  function receiveAttack(x, y) {
    if (sea[y][x] === 0) {
      sea[y][x] = "-";
    } else if (sea[y][x] === 1) {
      sea[y][x] = "+";
    } else {
      console.log("position already attacked, try again");
    }
  }

  return { getSea, receiveAttack };
}
