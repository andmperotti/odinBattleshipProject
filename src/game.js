import { Player } from "./player.js";

export function game(playerOneName, playerTwoName, playerTwoType) {
  let players = [
    { playerInstance: new Player(playerOneName) },
    {
      playerInstance: new Player(playerTwoName, playerTwoType),
    },
  ];
  let attackingPlayer = players[0];
  let defendingPlayer = players[1];

  function switchPlayers() {
    let tempPlaceholder = attackingPlayer;
    attackingPlayer = defendingPlayer;
    defendingPlayer = tempPlaceholder;
  }

  return {
    players,
    get attackingPlayer() {
      return attackingPlayer;
    },
    get defendingPlayer() {
      return defendingPlayer;
    },
    switchPlayers,
  };
}

//Make the game object hold the values for player names and types, make game hold logic for the game actions.
