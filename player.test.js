/* eslint-disable no-undef */
import { gameboard } from "./gameboard.js";
import { Player } from "./player.js";

describe("Player class tests", () => {
  test("test player type", () => {
    expect(new Player("human")).toMatchObject({ type: "human" });
    expect(new Player("computer")).toMatchObject({ type: "computer" });
  });

  test("test player gameboard", () => {
    let testPlayer = new Player("human");
    expect(testPlayer.gameboard).toHaveProperty(`_isGameboardInstance`);
  });
});
