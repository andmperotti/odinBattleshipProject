import { Player } from "./player.js";
import "./style.css";

class Game {
  constructor(playerOneName, playerTwoName, playerTwoType) {
    this.players = [
      new Player(playerOneName),
      new Player(playerTwoName, playerTwoType),
    ];
    this.attackingPlayer = this.players[0];
    this.defendingPlayer = this.players[1];
  }

  switchPlayers() {
    // eslint-disable-next-line no-unused-vars
    let tempPlaceholder = this.attackingPlayer;
    this.attackingPlayer = this.defendingPlayer;
    this.defendingPlayer = this.tempPlaceholder;
  }
}

//game driving:

let body = document.querySelector("body");
let gameTitle = document.createElement("h1");
gameTitle.textContent = "Battleship";
body.appendChild(gameTitle);
//create variable to keep track of game in progress
let gameState = false;
//variables for storing gameboards to
let defenseBoard;
let attackBoard;

//initiate newGameModal at load / on refresh
newGameShowHide();

//new game modal
function newGameModal() {
  let startGameModal = document.createElement("div");
  body.appendChild(startGameModal);
  //header for startGameModal
  let startGameHeader = document.createElement("h1");
  startGameHeader.textContent = "New Game";
  startGameModal.appendChild(startGameHeader);
  startGameModal.id = "start-game-modal";
  //create form element for inputs
  let startGameInputs = document.createElement("form");
  startGameInputs.id = "start-game-inputs";
  //create and add input elements to form
  let playerOneLabel = document.createElement("label");
  playerOneLabel.textContent = "Player 1 Name";
  let playerOneInput = document.createElement("input");
  playerOneInput.required = true;
  playerOneInput.placeholder = "ex: Drew";
  playerOneInput.id = "player-one-name";
  playerOneInput.autocomplete = "off";
  playerOneLabel.appendChild(playerOneInput);
  startGameInputs.appendChild(playerOneLabel);
  let playerTwoNameLabel = document.createElement("label");
  playerTwoNameLabel.textContent = "Player 2 Name";
  let playerTwoNameInput = document.createElement("input");
  playerTwoNameInput.placeholder = "ex: Steven";
  playerTwoNameInput.id = "player-two-name";
  playerTwoNameInput.autocomplete = "off";
  playerTwoNameLabel.appendChild(playerTwoNameInput);
  startGameInputs.appendChild(playerTwoNameLabel);
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
  playerTwoTypeRadioHumanLabel.appendChild(playerTwoTypeRadioHuman);
  playerTwoTypeFieldset.appendChild(playerTwoTypeRadioHumanLabel);
  let playerTwoTypeRadioComputer = document.createElement("input");
  playerTwoTypeRadioComputer.type = "radio";
  playerTwoTypeRadioComputer.name = "type";
  playerTwoTypeRadioComputer.id = "player-two-computer";
  let playerTwoTypeRadioComputerLabel = document.createElement("label");
  playerTwoTypeRadioComputerLabel.for = "player-two-computer";
  playerTwoTypeRadioComputerLabel.textContent = "Computer";
  playerTwoTypeRadioComputerLabel.appendChild(playerTwoTypeRadioComputer);
  playerTwoTypeFieldset.appendChild(playerTwoTypeRadioComputerLabel);

  startGameInputs.appendChild(playerTwoTypeFieldset);
  //button for submitting input and starting game
  let beginGameButton = document.createElement("button");
  beginGameButton.type = "submit";
  beginGameButton.textContent = "Commence Battle";
  beginGameButton.id = "begin-game";
  startGameInputs.appendChild(beginGameButton);
  //add button to start game modal
  startGameModal.appendChild(startGameInputs);

  //listener on form that sends input values to variables and technically starts game
  startGameInputs.addEventListener("submit", (e) => {
    e.preventDefault();
    let playerOneName = document.querySelector("#player-one-name").value;
    let playerTwoName = document.querySelector("#player-two-name").value;
    let playerTwoType = document.querySelector("#player-two-type").value;
    gameState = new Game(playerOneName, playerTwoName, playerTwoType);

    //call function to hide startGameModal, followed by the function to clear that modals input values
    startGameModal.remove();

    //invoke method that allows players to place ships, or automatically assign ships
    // placeShips();

    //automatically assign before writing logic for placeShips ui method:
    //5 ships: carrier of 5 length, battleship of 4 length, destroyer of 3 length, submarine of 3 length, patrol boat of 2 length
    //try to assign each randomly
    //while loop which runs until 5 boats have been added to a players boats array:
    while (gameState.players[0].gameboard.boats.length < 4) {
      let orientations = ["up", "down", "left", "right"];
      //place a carrier (5 length) while there isn't one
      while (
        gameState.players[0].gameboard.boats.filter((boat) => boat.length === 5)
          .length < 1
      ) {
        gameState.players[0].gameboard.placeShip(
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
          orientations[Math.floor(Math.random() * 4)],
          // eslint-disable-next-line prettier/prettier
          5
        );
      }
      //place a battleship (4 length) while there isn't one
      while (
        gameState.players[0].gameboard.boats.filter((boat) => boat.length === 4)
          .length < 1
      ) {
        gameState.players[0].gameboard.placeShip(
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
          orientations[Math.floor(Math.random() * 4)],
          // eslint-disable-next-line prettier/prettier
          4
        );
      }
      //place a destroyer (3 length) while there isn't one
      while (
        gameState.players[0].gameboard.boats.filter((boat) => boat.length === 3)
          .length < 1
      ) {
        gameState.players[0].gameboard.placeShip(
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
          orientations[Math.floor(Math.random() * 4)],
          // eslint-disable-next-line prettier/prettier
          3
        );
      }
      //place a submarine (3 length) while there isn't one
      while (
        gameState.players[0].gameboard.boats.filter((boat) => boat.length === 3)
          .length < 2
      ) {
        gameState.players[0].gameboard.placeShip(
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
          orientations[Math.floor(Math.random() * 4)],
          // eslint-disable-next-line prettier/prettier
          3
        );
      }
      //place a patrol boat (2 length) while there isn't one
      while (
        gameState.players[0].gameboard.boats.filter((boat) => boat.length === 2)
          .length < 1
      ) {
        gameState.players[0].gameboard.placeShip(
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
          orientations[Math.floor(Math.random() * 4)],
          // eslint-disable-next-line prettier/prettier
          2
        );
      }
    }

    //repeat for player 2
    while (gameState.players[1].gameboard.boats.length < 4) {
      let orientations = ["up", "down", "left", "right"];
      //place a carrier (5 length) while there isn't one
      while (
        gameState.players[1].gameboard.boats.filter((boat) => boat.length === 5)
          .length < 1
      ) {
        gameState.players[1].gameboard.placeShip(
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
          orientations[Math.floor(Math.random() * 4)],
          // eslint-disable-next-line prettier/prettier
          5
        );
      }
      //place a battleship (4 length) while there isn't one
      while (
        gameState.players[1].gameboard.boats.filter((boat) => boat.length === 4)
          .length < 1
      ) {
        gameState.players[1].gameboard.placeShip(
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
          orientations[Math.floor(Math.random() * 4)],
          // eslint-disable-next-line prettier/prettier
          4
        );
      }
      //place a destroyer (3 length) while there isn't one
      while (
        gameState.players[1].gameboard.boats.filter((boat) => boat.length === 3)
          .length < 1
      ) {
        gameState.players[1].gameboard.placeShip(
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
          orientations[Math.floor(Math.random() * 4)],
          // eslint-disable-next-line prettier/prettier
          3
        );
      }
      //place a submarine (3 length) while there isn't one
      while (
        gameState.players[1].gameboard.boats.filter((boat) => boat.length === 3)
          .length < 2
      ) {
        gameState.players[1].gameboard.placeShip(
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
          orientations[Math.floor(Math.random() * 4)],
          // eslint-disable-next-line prettier/prettier
          3
        );
      }
      //place a patrol boat (2 length) while there isn't one
      while (
        gameState.players[1].gameboard.boats.filter((boat) => boat.length === 2)
          .length < 1
      ) {
        gameState.players[1].gameboard.placeShip(
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
          orientations[Math.floor(Math.random() * 4)],
          // eslint-disable-next-line prettier/prettier
          2
        );
      }
    }
    //direct device to be given to player 1
    firstMoveModal();
  });
}
//display game start modal when there is not a current game running. At load there is no gameState therefore the startGameModal shows
function newGameShowHide() {
  if (!gameState) {
    newGameModal();
  }
}

//function that creates a modal telling the players to give the computer to the first player, if there are 2 human players, will be used after 'Commence Battle' button is clicked
function firstMoveModal() {
  let firstPlayerMoveModal = document.createElement("div");
  firstPlayerMoveModal.style.backgroundColor = "gray";
  firstPlayerMoveModal.style.padding = "1ch";
  firstPlayerMoveModal.style.borderRadius = "2%";
  firstPlayerMoveModal.style.display = "hidden";
  firstPlayerMoveModal.id = "first-player-modal";
  let contextSwitch = document.createElement("h2");
  contextSwitch.textContent = `Give the computer to: ${gameState.attackingPlayer.name}`;
  firstPlayerMoveModal.appendChild(contextSwitch);
  let playerOneAttackButton = document.createElement("button");
  playerOneAttackButton.type = "button";
  playerOneAttackButton.textContent = "Continue";
  firstPlayerMoveModal.appendChild(playerOneAttackButton);
  body.appendChild(firstPlayerMoveModal);
  firstPlayerMoveModal.style.display = "grid";

  //listener on playerOneAttackButton which builds an attacking screen for player 1; which invokes a function that builds a ui for player 1 to attack, and will be reusable whenever it's a players turn
  playerOneAttackButton.addEventListener("click", () => {
    buildAttackModal();
    firstPlayerMoveModal.remove();
  });
}

function buildAttackModal() {
  //we have playerOneSeaBoard and playerTwoSeaBoard already made at this point, which can be used for showing the attacker their own board
  let attackScreen = document.createElement("section");
  attackScreen.classList.add = "attack-screen";

  body.appendChild(attackScreen);
  let attackHeader = document.createElement("h2");
  attackHeader.textContent = `${gameState.attackingPlayer} Attack Screen`;
  attackScreen.appendChild(attackHeader);
  //show opponents sea, filter elements to display things other than numbers: blue background with a space or underscore for an unattacked sea-spot, yellow background with a '-' for a miss, and green background color with a '+' for a hit.
  attackBoard = buildSeaBoard(gameState.defendingPlayer);
  attackScreen.appendChild(attackBoard);
  let defendingHeader = document.createElement("h2");
  defendingHeader.textContent = "Your sea so far:";
  attackScreen.appendChild(defendingHeader);
  defenseBoard = buildSeaBoard(gameState.attackingPlayer);
  attackScreen.appendChild(defenseBoard);
}

//switch player modal function
function switchPlayerModal() {
  let switchPlayerModal = document.createElement("div");
  switchPlayerModal.style.display = "hidden";
  switchPlayerModal.id = "switch-player-modal";
  let contextSwitch = document.createElement("h2");
  contextSwitch.textContent = "Switch Player";
  switchPlayerModal.appendChild(contextSwitch);
  let switchPlayerButton = document.createElement("button");
  switchPlayerButton.type = "button";
  switchPlayerButton.textContent = "Switch";
  switchPlayerModal.appendChild(switchPlayerButton);
  body.appendChild(switchPlayerModal);
  switchPlayerModal.style.display = "grid";
  let switchPlayerNotice = document.createElement("p");
  switchPlayerNotice.textContent = `Please give the computer to: ${gameState.attackingPlayer.name}`;
  switchPlayerModal.appendChild(switchPlayerNotice);

  //event listener for switch player modal switch button, which initially will just hide the switch player modal, later will show the attacking players seaBoard
  switchPlayerButton.addEventListener("click", () => {
    gameState.switchPlayers();
    switchPlayerModal.remove();
    buildAttackModal();
  });
}

function buildSeaBoard(player) {
  //what if we build a modal for each player that had their sea board to show their opponents moves on their board, and a board with their attacks results displayed, and each time we switch player the modal shown switches, and of course listeners will be on different elements

  //build board for showing attacking players own sea
  if (player.name === gameState.attackingPlayer.name) {
    let seaBoard = document.createElement("section");
    seaBoard.className = "sea-board";
    //build rows of seaBoard, i is the y axis
    for (let i = 0; i < player.gameboard.sea.length; i++) {
      let seaRow = document.createElement("section");
      seaRow.className = "sea-row";
      seaRow.dataset.rowId = i;
      seaBoard.appendChild(seaRow);
      //build spans for each element in the row, j is the x axis
      for (let j = 0; j < player.gameboard.sea[i].length; j++) {
        let seaSpot = document.createElement("span");
        seaSpot.className = "sea-spot";
        seaSpot.dataset.seaId = `${i},${j}`;
        seaSpot.textContent = player.gameboard.sea[i][j];
        seaRow.appendChild(seaSpot);
      }
    }
    return seaBoard;
    //build board for showing attack sea, aka filtered defenders sea board
  } else if (player.name === gameState.defendingPlayer.name) {
    let filteredSea = player.gameboard.sea.map((row) =>
      row.map((spot) => {
        if (typeof spot === "number") {
          return " ";
        } else {
          return spot;
        }
        // eslint-disable-next-line prettier/prettier
      })
    );
    let seaBoard = document.createElement("section");
    seaBoard.className = "attack-sea-board";
    //build rows of seaBoard, i is the y axis
    for (let i = 0; i < filteredSea.length; i++) {
      let seaRow = document.createElement("section");
      seaRow.className = "attack-sea-row";
      seaRow.dataset.rowId = i;
      seaBoard.appendChild(seaRow);
      //build spans for each element in the row, j is the x axis
      for (let j = 0; j < filteredSea[i].length; j++) {
        let seaSpot = document.createElement("span");
        seaSpot.className = "attack-sea-spot";
        seaSpot.dataset.seaId = `${i},${j}`;
        seaSpot.textContent = filteredSea[i][j];
        if (seaSpot.textContent === "-") {
          seaSpot.classList.add("missed-attack");
        } else if (seaSpot.textContent === "+") {
          seaSpot.classList.add("hit-attack");
        } else {
          seaSpot.classList.add("unattacked");
        }
        seaRow.appendChild(seaSpot);
      }
    }
    return seaBoard;
  }
}
//function placeShips() {
//a system to allow players to place their ships

//render empty sea boards so users can place ships
//orientation buttons
//
// let placeShips = document.createElement("section");
// placeShips.id = "place-ships";
// let placeShipsHeader = document.createElement("h2");
// placeShipsHeader.textContent = "Place Ships";
// placeShips.appendChild(placeShipsHeader);
// body.appendChild(placeShips);
// let playerIdentifier = document.createElement("span");
// playerIdentifier.textContent = `Player: ${gameState.players[0].name}`;
// playerIdentifier.className = "player-identifier";
// placeShips.appendChild(playerIdentifier);
// placeShips.appendChild(playerOneSeaBoard);
//player one place ships
//modal that shows players sea board
//some kind of input for creating a ship of some size
//after which you can place the ship
//confirmation box after each placed?
//maybe allow for deleting of ships if they change their mind
//final confirmation of all placements
//
//
//player two then place ships, IF THERE'S A PLAYER TWO
//if(gameState.players[1].type==='human')
//}
