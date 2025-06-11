import Game from "./game";
import "./style.css";

let body = document.querySelector("body");
//create variables to keep track off a game is in progress, player1's name, player2's name, and player2's type
let gameState = false;
let playerOneName;
let playerTwoName;
let playerTwoType;
//could save these into a Game instance....

let startGameModal = document.createElement("div");
body.appendChild(startGameModal);

let startGameHeader = document.createElement("h1");
startGameHeader.textContent = "Battleship";
startGameModal.appendChild(startGameHeader);
startGameModal.id = "start-game-modal";

let playerInputs = document.createElement("form");
playerInputs.id = "player-inputs";

let playerOneLabel = document.createElement("label");
playerOneLabel.textContent = "Player 1 Name";
let playerOneInput = document.createElement("input");
playerOneInput.placeholder = "ex: Drew";
playerOneInput.id = "player-one-name";
playerOneLabel.appendChild(playerOneInput);

playerInputs.appendChild(playerOneLabel);

let playerTwoNameLabel = document.createElement("label");
playerTwoNameLabel.textContent = "Player 2 Name";
let playerTwoNameInput = document.createElement("input");
playerTwoNameInput.placeholder = "ex: Steven";
playerTwoNameInput.id = "player-two-name";
playerTwoNameLabel.appendChild(playerTwoNameInput);
playerInputs.appendChild(playerTwoNameLabel);

let playerTwoTypeFieldset = document.createElement("fieldset");
let playerTwoTypeLegend = document.createElement("legend");
playerTwoTypeLegend.textContent = "Player 2 type";
playerTwoTypeFieldset.id = "player-two-type-fieldset";
playerTwoTypeFieldset.appendChild(playerTwoTypeLegend);
let playerTwoTypeRadioHuman = document.createElement("input");
playerTwoTypeRadioHuman.type = "radio";
playerTwoTypeRadioHuman.value = "human";
playerTwoTypeRadioHuman.id = "player-two-human";
playerTwoTypeRadioHuman.name = "type";
let playerTwoTypeRadioHumanLabel = document.createElement("label");
playerTwoTypeRadioHumanLabel.textContent = "Human";
playerTwoTypeRadioHumanLabel.for = "player-two-human";
playerTwoTypeFieldset.appendChild(playerTwoTypeRadioHuman);
playerTwoTypeFieldset.appendChild(playerTwoTypeRadioHumanLabel);
let playerTwoTypeRadioComputer = document.createElement("input");
playerTwoTypeRadioComputer.type = "radio";
playerTwoTypeRadioComputer.name = "type";

playerTwoTypeRadioComputer.id = "player-two-computer";
playerTwoTypeFieldset.appendChild(playerTwoTypeRadioComputer);
let playerTwoTypeRadioComputerLabel = document.createElement("label");
playerTwoTypeRadioComputerLabel.for = "player-two-computer";
playerTwoTypeRadioComputerLabel.textContent = "Computer";
playerTwoTypeFieldset.appendChild(playerTwoTypeRadioComputerLabel);
playerInputs.appendChild(playerTwoTypeFieldset);

let beginGameButton = document.createElement("button");
beginGameButton.type = "button";
beginGameButton.textContent = "Commence Battle";
beginGameButton.id = "begin-game";
playerInputs.appendChild(beginGameButton);

startGameModal.appendChild(playerInputs);

//display game start modal when there is not a current game running
if (gameState) {
  startGameModal.remove();
}

//listener on begin button that saves input values to variables and technically starts game
beginGameButton.addEventListener("click", () => {
  playerOneName = document.querySelector("#player-one-name").value;
  playerTwoName = document.querySelector("#player-two-name").value;
  playerTwoType = document.querySelector("#player-two-type").value;
});
