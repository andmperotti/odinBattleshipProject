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
  let switchPlayerNotice = document.createElement("p");
  switchPlayerNotice.textContent = `Please give the computer to player: ${attackingPlayer}`;
  switchPlayerModal.appendChild(switchPlayerNotice);

  //event listener for switch player modal switch button, which initially will just hide the switch player modal, later will show the attacking players gameboard
  switchPlayerButton.addEventListener("click", () => {
    attackingPlayer = defendingPlayer;
    defendingPlayer = attackingPlayer;
    switchPlayerModal.remove();
    //and show gameboard of next player
  });
}

//player1 position boats and of what size
//confirm placement button
//logic to check that 5 ships have been placed

//if two human players: switch players

//player 2 position boats and of what size
//confirm placement button
//logic to check that 5 ships have been placed

//switch players
//start battling until either player is out of ships....

//player 1 attacks
//selects position to attack, confirms
//is told if they hit or missed, button clicked to close message

//switch modal

//player 2 is told if player 1 hit or missed and where they attacked, button click to close message
//player 2 attacks :
//selects position to attack, confirms
//is told if they hit or missed, button clicks to close message

//switch modal

//player 1 is told if player 2 hit or missed and where they attacked, button click to close message
//selects position to attack, confirms
//is told if they hit or missed, button click to close message
//switch...on and on

//when a player has won
//tell that user right after their attack has landed the last killing blow on the last ship, button to click to close
//display final result modal, which shows both gameboards and displays timer of the game

//if one human player
//player 1 attacks computer ships, confirms attack
//player 1 is told computer has hit or missed and where
//repeat until either player1 or computer has lost
//message that tells human who has won, click confirm
//shows final result page with both gameboards

//gameboard function, given a player it displays their attacking gameboard, adn their defending gameboard, both
