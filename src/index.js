// import { game } from "./game.js";
// import "./style.css";

// let body = document.querySelector("body");
// let gameTitle = document.createElement("h1");
// gameTitle.textContent = "Battleship";
// body.appendChild(gameTitle);
// //create variable to keep track of a game in progress
// let gameState = false;
// let playerOneSeaBoard;
// let playerTwoSeaBoard;
// newGameShowHide();

// //new game modal
// function newGameModal() {
//   let startGameModal = document.createElement("div");
//   body.appendChild(startGameModal);
//   //header for startGameModal
//   let startGameHeader = document.createElement("h1");
//   startGameHeader.textContent = "New Game";
//   startGameModal.appendChild(startGameHeader);
//   startGameModal.id = "start-game-modal";
//   //create form element for inputs
//   let startGameInputs = document.createElement("form");
//   startGameInputs.id = "start-game-inputs";
//   //create and add input elements to form
//   let playerOneLabel = document.createElement("label");
//   playerOneLabel.textContent = "Player 1 Name";
//   let playerOneInput = document.createElement("input");
//   playerOneInput.required = true;
//   playerOneInput.placeholder = "ex: Drew";
//   playerOneInput.id = "player-one-name";
//   playerOneInput.autocomplete = "off";
//   playerOneLabel.appendChild(playerOneInput);
//   startGameInputs.appendChild(playerOneLabel);
//   let playerTwoNameLabel = document.createElement("label");
//   playerTwoNameLabel.textContent = "Player 2 Name";
//   let playerTwoNameInput = document.createElement("input");
//   playerTwoNameInput.placeholder = "ex: Steven";
//   playerTwoNameInput.id = "player-two-name";
//   playerTwoNameInput.autocomplete = "off";
//   playerTwoNameLabel.appendChild(playerTwoNameInput);
//   startGameInputs.appendChild(playerTwoNameLabel);
//   //fieldset to contain radio inputs
//   let playerTwoTypeFieldset = document.createElement("fieldset");
//   let playerTwoTypeLegend = document.createElement("legend");
//   playerTwoTypeLegend.textContent = "Player 2 type";
//   playerTwoTypeFieldset.id = "player-two-type";
//   playerTwoTypeFieldset.appendChild(playerTwoTypeLegend);
//   //radio inputs with labels
//   let playerTwoTypeRadioHuman = document.createElement("input");
//   playerTwoTypeRadioHuman.type = "radio";
//   playerTwoTypeRadioHuman.value = "human";
//   playerTwoTypeRadioHuman.required = true;
//   playerTwoTypeRadioHuman.id = "player-two-human";
//   playerTwoTypeRadioHuman.name = "type";
//   let playerTwoTypeRadioHumanLabel = document.createElement("label");
//   playerTwoTypeRadioHumanLabel.textContent = "Human";
//   playerTwoTypeRadioHumanLabel.for = "player-two-human";
//   playerTwoTypeFieldset.appendChild(playerTwoTypeRadioHuman);
//   playerTwoTypeFieldset.appendChild(playerTwoTypeRadioHumanLabel);
//   let playerTwoTypeRadioComputer = document.createElement("input");
//   playerTwoTypeRadioComputer.type = "radio";
//   playerTwoTypeRadioComputer.name = "type";
//   playerTwoTypeRadioComputer.id = "player-two-computer";
//   playerTwoTypeFieldset.appendChild(playerTwoTypeRadioComputer);
//   let playerTwoTypeRadioComputerLabel = document.createElement("label");
//   playerTwoTypeRadioComputerLabel.for = "player-two-computer";
//   playerTwoTypeRadioComputerLabel.textContent = "Computer";
//   playerTwoTypeFieldset.appendChild(playerTwoTypeRadioComputerLabel);
//   startGameInputs.appendChild(playerTwoTypeFieldset);
//   //button for submitting input and starting game
//   let beginGameButton = document.createElement("button");
//   beginGameButton.type = "submit";
//   beginGameButton.textContent = "Commence Battle";
//   beginGameButton.id = "begin-game";
//   startGameInputs.appendChild(beginGameButton);
//   //add button to start game modal
//   startGameModal.appendChild(startGameInputs);

//   //listener on form that sends input values to variables and technically starts game
//   startGameInputs.addEventListener("submit", (e) => {
//     e.preventDefault();
//     let playerOneName = document.querySelector("#player-one-name").value;
//     let playerTwoName = document.querySelector("#player-two-name").value;
//     let playerTwoType = document.querySelector("#player-two-type").value;
//     gameState = game(playerOneName, playerTwoName, playerTwoType);
//     //invoke buildSeaBoard() to create player boards that will be used in turns
//     playerOneSeaBoard = buildSeaBoard(gameState.players[0]);
//     playerTwoSeaBoard = buildSeaBoard(gameState.players[1]);
//     //call function to hide startGameModal, followed by the function to clear that modals input values
//     startGameModal.remove();
//     placeShips();
//   });
// }
// //display game start modal when there is not a current game running. At load there is no gameState therefore the startGameModal shows
// function newGameShowHide() {
//   if (!gameState) {
//     newGameModal();
//   }
// }

// //switch player modal function
// function switchPlayerModal() {
//   let switchPlayerModal = document.createElement("div");
//   switchPlayerModal.style.display = "hidden";
//   switchPlayerModal.id = "switch-player-modal";
//   let contextSwitch = document.createElement("h2");
//   contextSwitch.textContent = "Switch Player";
//   switchPlayerModal.appendChild(contextSwitch);
//   let switchPlayerButton = document.createElement("button");
//   switchPlayerButton.type = "button";
//   switchPlayerButton.textContent = "Switch";
//   switchPlayerModal.appendChild(switchPlayerButton);
//   body.appendChild(switchPlayerModal);
//   switchPlayerModal.style.display = "grid";
//   let switchPlayerNotice = document.createElement("p");
//   switchPlayerNotice.textContent = `Please give the computer to: ${gameState.attackingPlayer.name}`;
//   switchPlayerModal.appendChild(switchPlayerNotice);

//   //event listener for switch player modal switch button, which initially will just hide the switch player modal, later will show the attacking players seaBoard
//   switchPlayerButton.addEventListener("click", () => {
//     gameState.switchPlayers();
//     switchPlayerModal.remove();
//     //call turn board...
//   });
// }

// //i think i want this function to build a board given a seaBoard, so we could filter a players sea board, to build an attacking board for current attacking player
// //so need to adjust this function to meet ^
// function buildSeaBoard(player) {
//   let seaBoard = document.createElement("section");
//   seaBoard.className = "sea-board";
//   //build rows of seaBoard, i is the y axis
//   for (let i = 0; i < player.playerInstance.gameboard.sea.length; i++) {
//     let seaRow = document.createElement("section");
//     seaRow.className = "sea-row";
//     seaRow.dataset.rowId = i;
//     seaBoard.appendChild(seaRow);
//     //build spans for each element in the row, j is the x axis
//     for (let j = 0; j < player.playerInstance.gameboard.sea[i].length; j++) {
//       let seaSpot = document.createElement("span");
//       seaSpot.className = "sea-spot";
//       seaSpot.dataset.seaId = `${i},${j}`;
//       seaSpot.textContent = player.playerInstance.gameboard.sea[i][j];
//       seaRow.appendChild(seaSpot);
//     }
//   }
//   return seaBoard;
// }
// //function placeShips() {
// //at first we'll use predetermined coordinates:
// //gameState.
// //later we'll have a system to allow players to place their ships
// // let placeShips = document.createElement("section");
// // placeShips.id = "place-ships";
// // let placeShipsHeader = document.createElement("h2");
// // placeShipsHeader.textContent = "Place Ships";
// // placeShips.appendChild(placeShipsHeader);
// // body.appendChild(placeShips);
// // let playerIdentifier = document.createElement("span");
// // playerIdentifier.textContent = `Player: ${gameState.players[0].name}`;
// // playerIdentifier.className = "player-identifier";
// // placeShips.appendChild(playerIdentifier);
// // placeShips.appendChild(playerOneSeaBoard);
// //player one place ships
// //modal that shows players sea board
// //some kind of input for creating a ship of some size
// //after which you can place the ship
// //confirmation box after each placed?
// //maybe allow for deleting of ships if they change their mind
// //final confirmation of all placements
// //
// //
// //player two then place ships, IF THERE'S A PLAYER TWO
// //if(gameState.players[1].playerInstance.type==='human')
// //}
