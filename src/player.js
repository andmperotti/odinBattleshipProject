import { gameboard } from "./gameboard";

export class Player {
  constructor(type = "human") {
    this.type = type.toLowerCase();
    this.gameboard = gameboard();
  }
}
