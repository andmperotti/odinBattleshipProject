import { describe, expect, test } from "@jest/globals";
import game from "./game.js";

describe("testing game factory function", () => {
  let testGame = game("drew", "comp", "Computer");

  test("first player created", () => {
    expect(testGame.players[0].name).toBe("drew");
  });

  test("second player created", () => {
    expect(testGame.players[1].name).toBe("comp");
  });
  test("second player type", () => {
    expect(testGame.players[1].type).toBe("Computer");
  });
});
