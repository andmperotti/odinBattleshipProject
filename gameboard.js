import { ship } from "./ship.js";

export function gameboard() {
  let sea = Array.from({ length: 10 }, (sub) =>
    Array.from({ length: 10 }, (element) => 0)
  );
  function getSea() {
    return sea;
  }

  return { getSea };
}
