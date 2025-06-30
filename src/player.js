import { Gameboard } from "./gameboard";

export class Player {
  constructor(name, type = "human") {
    this.name = name;
    this.type = type.toLowerCase();
    this.gameboard = new Gameboard();
  }
}
