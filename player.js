import { gameboard } from "./gameboard";

export class Player {
  constructor(type) {
    this.type = type;
    this.gameboard = gameboard();
  }
}
