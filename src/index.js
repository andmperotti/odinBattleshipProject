import { game } from "./game.js";
import "./style.css";

let body = document.querySelector("body");
//create variable to keep track of a game in progress
let gameState = false;
//variables to keep track of which player is attacking and defending
let attackingPlayer;
let defendingPlayer;

//new game modal
let startGameModal = document.createElement("div");
body.appendChild(startGameModal);
//header for startGameModal
let startGameHeader = document.createElement("h1");
startGameHeader.textContent = "Battleship";
startGameModal.appendChild(startGameHeader);
startGameModal.id = "start-game-modal";
//create form element for inputs
let playerInputs = document.createElement("form");
playerInputs.id = "player-inputs";
//create and add input elements to form
let playerOneLabel = document.createElement("label");
playerOneLabel.textContent = "Player 1 Name";
let playerOneInput = document.createElement("input");
playerOneInput.required = true;
playerOneInput.placeholder = "ex: Drew";
playerOneInput.id = "player-one-name";
playerOneInput.autocomplete = "off";
playerOneLabel.appendChild(playerOneInput);
playerInputs.appendChild(playerOneLabel);
let playerTwoNameLabel = document.createElement("label");
playerTwoNameLabel.textContent = "Player 2 Name";
let playerTwoNameInput = document.createElement("input");
playerTwoNameInput.placeholder = "ex: Steven";
playerTwoNameInput.id = "player-two-name";
playerTwoNameInput.autocomplete = "off";
playerTwoNameLabel.appendChild(playerTwoNameInput);
playerInputs.appendChild(playerTwoNameLabel);
//fieldset to contain radio inputs
let playerTwoTypeFieldset = document.createElement("fieldset");
let playerTwoTypeLegend = document.createElement("legend");
playerTwoTypeLegend.textContent = "Player 2 type";
playerTwoTypeFieldset.id = "player-two-type";
playerTwoTypeFieldset.appendChild(playerTwoTypeLegend);
//radio inputs with labels
let playerTwoTypeRadioHuman = document.createElement("input");
playerTwoTypeRadioHuman.type = "radio";
playerTwoTypeRadioHuman.value = "human";
playerTwoTypeRadioHuman.required = true;
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
//button for submitting input and starting game
let beginGameButton = document.createElement("button");
beginGameButton.type = "submit";
beginGameButton.textContent = "Commence Battle";
beginGameButton.id = "begin-game";
playerInputs.appendChild(beginGameButton);
//add button to start game modal
startGameModal.appendChild(playerInputs);

//display game start modal when there is not a current game running. At load there is no gameState therefore the startGameModal shows
function newGameShowHide() {
  if (gameState) {
    startGameModal.style.display = "none";
  } else {
    startGameModal.style.display = "inline-flex";
  }
}

//listener on form that sends input values to variables and technically starts game
playerInputs.addEventListener("submit", (e) => {
  e.preventDefault();
  let playerOneName = document.querySelector("#player-one-name").value;
  let playerTwoName = document.querySelector("#player-two-name").value;
  let playerTwoType = document.querySelector("#player-two-type").value;
  gameState = game(playerOneName, playerTwoName, playerTwoType);
  attackingPlayer = gameState.players[0].name;
  defendingPlayer = gameState.players[1].name;
  //invoke function to either show or hide startGameModal, at this usage it will hide the modal as there is not a gameState
  newGameShowHide();
  clearInputFields();
  switchPlayerModal();
});

//function to clear input fields of startGameModal
function clearInputFields() {
  playerOneInput.value = "";
  playerTwoNameInput.value = "";
  playerTwoTypeRadioHuman.checked = false;
  playerTwoTypeRadioComputer.checked = false;
}

//switch player modal function
function switchPlayerModal() {
  let switchPlayerModal = document.createElement("div");
  switchPlayerModal.style.display = "hidden";
  switchPlayerModal.id = "switch-player-modal";
  let contextSwitch = document.createElement("h2");
  contextSwitch.textContent = `Please give the computer to ${attackingPlayer}`;
  switchPlayerModal.appendChild(contextSwitch);
  let switchPlayerButton = document.createElement("button");
  switchPlayerButton.type = "button";
  switchPlayerButton.textContent = "Switch";
  switchPlayerModal.appendChild(switchPlayerButton);
  body.appendChild(switchPlayerModal);
  switchPlayerModal.style.display = "grid";

  //event listener for switch player modal switch button, which initially will just hide the switch player modal, later will show the attacking players gameboard
  switchPlayerButton.addEventListener("click", () => {
    attackingPlayer = defendingPlayer;
    defendingPlayer = attackingPlayer;
    switchPlayerModal.remove();
    console.log(attackingPlayer);
    //and show gameboard of next player
  });
}
