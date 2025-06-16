import { describe, expect, test } from "@jest/globals";
import { game } from "./game.js";

describe("testing game factory function", () => {
  let testGame = game("drew", "comp", "Computer");

  test("first player created", () => {
    expect(testGame.players[0].name).toBe("drew");
  });
  test("first player Human type", () => {
    expect(testGame.players[0].playerInstance.type).toBe("human");
  });

  test("second player created", () => {
    expect(testGame.players[1].name).toBe("comp");
  });
  test("second player Computer type, and changing input to lowercase", () => {
    expect(testGame.players[1].playerInstance.type).toBe("computer");
  });
});
