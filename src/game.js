import { Player } from "./player.js";

export default function game(playerOneName, playerTwoName, playerTwoType) {
  let players = [
    { name: playerOneName, playerInstance: new Player() },
    { name: playerTwoName, playerInstance: new Player(playerTwoType) },
  ];

  return { players };
}

//Make the game object hold the values for player names and types, make game hold logic for the game actions. Change new game modal to hidden, not removed, that way when player clicks new game button we don't have to remake it
