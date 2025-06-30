import { describe, expect, test } from "@jest/globals";
import { Player } from "./player.js";

describe("Player class tests", () => {
  test("test player type", () => {
    expect(new Player("andrew", "human")).toMatchObject({
      name: "andrew",
      type: "human",
    });
    expect(new Player("ai", "computer")).toMatchObject({
      name: "ai",
      type: "computer",
    });
  });

  test("test player gameboard", () => {
    let testPlayer = new Player("steve", "human");
    expect(testPlayer.gameboard.isGameboardInstance).toBe(true);
  });
});
