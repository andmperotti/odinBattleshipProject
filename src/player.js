import { gameboard } from "./gameboard";

export class Player {
  constructor(type = "human") {
    this.type = type;
    this.gameboard = gameboard();
  }
}
