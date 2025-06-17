/**
 * @jest-environment jsdom
 */

// eslint-disable-next-line no-unused-vars
import { describe, expect, test, jest } from "@jest/globals";
import { game } from "./game.js";

//test startGameModal form submittance generates a game instance
//test input from user is saved to variables after submit button pressed which submits the form

//so i would like to mock the input fields, and create a game instance and check the data of that game instances against the mocked inputs
let gameState = false;
//build elements
const playerInputs = document.createElement("form");
document.querySelector("body").appendChild(playerInputs);
const playerOneNameInput = document.createElement("input");
playerInputs.appendChild(playerOneNameInput);
const playerTwoNameInput = document.createElement("input");
playerInputs.appendChild(playerTwoNameInput);
const playerTwoTypeFieldset = document.createElement("fieldset");
const playerTwoTypeHuman = document.createElement("input");
playerTwoTypeHuman.type = "radio";
playerTwoTypeHuman.value = "Human";
playerTwoTypeHuman.name = "player-type";
playerTwoTypeFieldset.appendChild(playerTwoTypeHuman);
playerTwoTypeFieldset.id = "player-two-type";
const playerTwoTypeComputer = document.createElement("input");
playerTwoTypeComputer.type = "radio";
playerTwoTypeComputer.value = "Computer";
playerTwoTypeComputer.name = "player-type";
playerTwoTypeFieldset.appendChild(playerTwoTypeComputer);
playerInputs.appendChild(playerTwoTypeFieldset);
const startBattle = document.createElement("button");
playerInputs.appendChild(startBattle);

//fill inputs values as if a users typed in values
playerOneNameInput.value = "Drew";
playerTwoNameInput.value = "Steven";
playerTwoTypeHuman.checked = true;

//temp test to make sure the jest dom input elements values are being changed
// test("test input elements values have been changed", () => {
//   expect(playerOneNameInput.value).toBe("Drew");
//   expect(playerTwoNameInput.value).toBe("Steven");
//   expect(playerTwoTypeHuman.value).toBe("Human");
// });

//listener on form that sends input values to variables and technically starts game
playerInputs.addEventListener("submit", (e) => {
  e.preventDefault();
  let playerOneName = playerOneNameInput.value;
  let playerTwoName = playerTwoNameInput.value;
  let playerTwoType = document.querySelector(
    // eslint-disable-next-line prettier/prettier
    'input[name="player-type"]:checked'
  ).value;
  test("test variables values which will be used as arguments", () => {
    expect(playerOneName).toBe("Drew");
    expect(playerTwoName).toBe("Steven");
    expect(playerTwoType).toBe("Human");
  });
  gameState = game(playerOneName, playerTwoName, playerTwoType);
});

//invoke form listener by invoking click method on button
startBattle.click();

test("creates a game instance with a players property that contains instances of Player and game, when the button is clicked and there is input meeting required fields", () => {
  //check if gameState is truthy, as it was initialized false
  expect(gameState).toBeTruthy();
  expect(gameState.players[0]).toMatchObject({
    name: "Drew",
    playerInstance: {
      type: "human",
    },
  });
  expect(gameState.players[0].playerInstance.gameboard).toHaveProperty(
    // eslint-disable-next-line prettier/prettier
    `_isGameboardInstance`
  );

  expect(gameState.players[1]).toMatchObject({
    name: "Steven",
    playerInstance: {
      type: "human",
    },
  });
  expect(gameState.players[1].playerInstance.gameboard).toHaveProperty(
    // eslint-disable-next-line prettier/prettier
    `_isGameboardInstance`
  );
});

