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
    this.players = [this.players[1], this.players[0]];
    this.attackingPlayer = this.players[0];
    this.defendingPlayer = this.players[1];
  }
}

//game driving:

let body = document.querySelector("body");
let gameTitle = document.createElement("h1");
gameTitle.textContent = "Battleship";
body.appendChild(gameTitle);
//create variable to keep track of game in progress
let gameState = false;
let lastMove;
let turnCount = 0;
let isModalActive = false;

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
  playerTwoTypeRadioComputer.value = "computer";
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
    let playerTwoType = document.querySelector(
      // eslint-disable-next-line prettier/prettier
      "#player-two-type input:checked"
    ).value;
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
  //variables for storing gameboards to
  let defenseBoard;
  let attackBoard;

  //create element to add to body for players to interact with when attacking other players ships
  let attackModal = document.createElement("section");
  attackModal.classList.add("attack-modal");

  body.appendChild(attackModal);
  let attackHeader = document.createElement("h2");
  attackHeader.textContent = `Player ${gameState.attackingPlayer.name}'s Attack Screen:`;
  attackHeader.classList.add("attack-header");
  attackModal.appendChild(attackHeader);
  //show opponents sea, convert elements to display things other than numbers: blue background with a space or underscore for a not attacked sea-spot, yellow background with a '-' for a miss, and green background color with a '+' for a hit.
  attackBoard = buildSeaBoard(gameState.defendingPlayer);
  let attackBoardHolder = document.createElement("section");
  attackBoardHolder.appendChild(attackBoard);
  attackBoardHolder.classList.add("attack-board-holder");
  attackModal.appendChild(attackBoardHolder);

  attackModal.appendChild(buildSeaKey());

  let defendingHeader = document.createElement("h2");
  defendingHeader.classList.add("defending-header");
  defendingHeader.textContent = `Player ${gameState.attackingPlayer.name}'s Defense Screen:`;
  attackModal.appendChild(defendingHeader);
  defenseBoard = buildSeaBoard(gameState.attackingPlayer);
  let defenseBoardHolder = document.createElement("section");
  defenseBoardHolder.classList.add("defense-board-holder");
  defenseBoardHolder.appendChild(defenseBoard);
  attackModal.appendChild(defenseBoardHolder);
  attackModal.appendChild(opponentsResult());

  let turnCounter = document.createElement("h3");
  turnCounter.textContent = `Turn: ${turnCount}`;
  turnCounter.classList.add("turn-counter");
  attackModal.appendChild(turnCounter);
  let attackExplainer = document.createElement("p");
  attackExplainer.textContent =
    "Click on a spot to attack it, a confirmation box will confirm your selection and the selected location will be highlighted";
  attackExplainer.classList.add("attack-explainer");
  attackModal.appendChild(attackExplainer);

  let attackerBoatsRemaining = document.createElement("h3");
  attackerBoatsRemaining.classList.add("attacker-boats-remaining");
  let attackerBoatCount = gameState.attackingPlayer.gameboard.boats.filter(
    // eslint-disable-next-line prettier/prettier
    (boat) => boat.sunk !== true
  ).length;
  attackerBoatsRemaining.textContent = `Your Ships left: ${attackerBoatCount} `;
  attackModal.appendChild(attackerBoatsRemaining);

  let defenseBoatsRemaining = gameState.defendingPlayer.gameboard.boats.filter(
    // eslint-disable-next-line prettier/prettier
    (boat) => boat.sunk !== true
  ).length;
  let defenderBoatsRemaining = document.createElement("h3");
  defenderBoatsRemaining.classList.add("defender-boats-remaining");
  defenderBoatsRemaining.textContent = `Opponents ships left: ${defenseBoatsRemaining}`;
  attackModal.appendChild(defenderBoatsRemaining);

  //variable to hold clicked attack location
  let attackLocationArray;

  //add function for sea spot listeners to invoke
  function verifyAttack() {
    isModalActive = true;
    let verifyAttackModal = document.createElement("section");
    verifyAttackModal.classList.add("verify-attack-modal");
    let verifyAttackHeader = document.createElement("h2");
    verifyAttackHeader.textContent = "Confirm Attack:";
    verifyAttackModal.appendChild(verifyAttackHeader);
    let verifyAttackExplanation = document.createElement("p");
    verifyAttackExplanation.textContent = `Are you sure you want to hit thee highlighted sea spot?`;
    verifyAttackModal.appendChild(verifyAttackExplanation);
    let confirmAttackButton = document.createElement("button");
    confirmAttackButton.textContent = "Confirm";
    confirmAttackButton.type = "button";
    verifyAttackModal.appendChild(confirmAttackButton);
    let cancelAttackButton = document.createElement("button");
    cancelAttackButton.textContent = "Cancel";
    cancelAttackButton.type = "button";
    verifyAttackModal.appendChild(cancelAttackButton);

    confirmAttackButton.addEventListener("click", () => {
      isModalActive = false;
      //call receiveAttack on defender gameboard using the spots dataset attributes
      gameState.defendingPlayer.gameboard.receiveAttack(
        attackLocationArray[0],
        // eslint-disable-next-line prettier/prettier
        attackLocationArray[1]
      );

      //conditional to build result string, if spot attacked is now a - then miss, if + then hit, update lastMove here
      if (
        gameState.defendingPlayer.gameboard.sea[attackLocationArray[0]][
          attackLocationArray[1]
        ] === "-"
      ) {
        lastMove = "Attack was a miss";
      } else if (
        gameState.defendingPlayer.gameboard.sea[attackLocationArray[0]][
          attackLocationArray[1]
        ] === "+"
      ) {
        lastMove = `Attack hit a ship`;
      }

      verifyAttackModal.remove();

      //call switch player if 2 humans playing otherwise have the computer attack and render new attackModal, maybe show a result modal in between, and a loading element, maybe even draw the modal, and display a loading message which dynamically turns in the result when the computer has finished attacking and then render the button for the player to move on to attack the computer
      if (gameState.players[1].type === "human") {
        turnCount++;
        switchPlayer();
      } else {
        turnCount++;
        attackModal.remove();
        //computer attacks

        //maybe show a temporary modal with a loading icon

        computerAttack();

        //maybe create a modal that tells the user what the computers turn resulted in, and use the result element in the attack modal as a reminder

        buildAttackModal();
      }
    });

    cancelAttackButton.addEventListener("click", () => {
      isModalActive = false;
      document
        .querySelector(".prospective-attack-location")
        .classList.remove("prospective-attack-location");
      verifyAttackModal.remove();
    });
    return verifyAttackModal;
  }
  //set listeners for attacks
  let attackSpots = document.querySelectorAll(".attack-sea-spot");
  attackSpots.forEach((el) => {
    if (el.textContent !== "-" && el.textContent !== "+") {
      el.addEventListener("click", () => {
        if (!isModalActive) {
          //save location clicked
          attackLocationArray = el.dataset.seaId.split(",");

          //add highlighting class to sea spot
          el.classList.add("prospective-attack-location");
          body.appendChild(verifyAttack());
        }
      });
    }
  });

  //render opponents last move string
  updateOpponentsResult();
}

//switch player modal function
function switchPlayer() {
  isModalActive = true;
  let switchPlayerModal = document.createElement("div");
  switchPlayerModal.id = "switch-player-modal";
  let contextSwitch = document.createElement("h2");
  contextSwitch.textContent = "Switch Player";
  switchPlayerModal.appendChild(contextSwitch);
  updateOpponentsResult();
  let resultText = document.createElement("p");
  resultText.textContent = `${lastMove}`;
  switchPlayerModal.appendChild(resultText);
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
    isModalActive = false;
    gameState.switchPlayers();
    switchPlayerModal.remove();
    document.querySelector(".attack-modal").remove();
    buildAttackModal();
  });
}

function buildSeaBoard(player) {
  //what if we build a modal for each player that had their sea board to show their opponents moves on their board, and a board with their attacks results displayed, and each time we switch player the modal shown switches, and of course listeners will be on different elements

  //build board for showing attacking players own sea
  if (player.name === gameState.attackingPlayer.name) {
    let seaBoard = document.createElement("section");
    seaBoard.className = "defense-sea-board";
    //build rows of seaBoard, i is the y axis
    for (let i = 0; i < player.gameboard.sea.length; i++) {
      let seaRow = document.createElement("section");
      seaRow.className = "defense-sea-row";
      seaRow.dataset.rowId = i;
      seaBoard.appendChild(seaRow);
      //build spans for each element in the row, j is the x axis
      for (let j = 0; j < player.gameboard.sea[i].length; j++) {
        let seaSpot = document.createElement("span");
        seaSpot.className = "defense-sea-spot";
        seaSpot.dataset.seaId = `${i},${j}`;
        if (player.gameboard.sea[i][j] === 0) {
          seaSpot.textContent = " ";
        } else {
          seaSpot.textContent = player.gameboard.sea[i][j];
        }
        seaRow.appendChild(seaSpot);
      }
    }
    return seaBoard;
    //build board for showing attack sea, aka converted defenders sea board
  } else if (player.name === gameState.defendingPlayer.name) {
    let convertedSea = player.gameboard.sea.map((row) =>
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
    for (let i = 0; i < convertedSea.length; i++) {
      let seaRow = document.createElement("section");
      seaRow.className = "attack-sea-row";
      seaRow.dataset.rowId = i;
      seaBoard.appendChild(seaRow);
      //build spans for each element in the row, j is the x axis
      for (let j = 0; j < convertedSea[i].length; j++) {
        let seaSpot = document.createElement("span");
        seaSpot.className = "attack-sea-spot";
        seaSpot.dataset.seaId = `${i},${j}`;
        seaSpot.textContent = convertedSea[i][j];
        if (seaSpot.textContent === "-") {
          seaSpot.classList.add("unsuccessful-attack");
        } else if (seaSpot.textContent === "+") {
          seaSpot.classList.add("successful-attack");
        } else {
          seaSpot.classList.add("not-attacked");
        }
        seaRow.appendChild(seaSpot);
      }
    }
    return seaBoard;
  }
}

function buildSeaKey() {
  let seaKey = document.createElement("section");
  let seaKeyHeader = document.createElement("h2");
  seaKeyHeader.textContent = "Key";
  seaKey.appendChild(seaKeyHeader);
  seaKey.classList.add("sea-key");
  let notAttackedDescription = document.createElement("p");
  notAttackedDescription.innerHTML += `<span class="not-attacked sea-spot"> </span> === non attacked spot`;
  seaKey.appendChild(notAttackedDescription);
  let missedAttackDescription = document.createElement("p");
  missedAttackDescription.innerHTML += `<span class="unsuccessful-attack sea-spot">-</span> === attack missed`;
  seaKey.appendChild(missedAttackDescription);
  let successfulAttack = document.createElement("p");
  successfulAttack.innerHTML += `<span class="successful-attack sea-spot">+</span> === attack hit`;
  seaKey.appendChild(successfulAttack);
  return seaKey;
}

function opponentsResult() {
  let opponentsResultModal = document.createElement("section");
  opponentsResultModal.classList.add("opponents-result");
  let opponentsHeader = document.createElement("h2");
  opponentsHeader.textContent = "Opponents last move result:";
  opponentsResultModal.appendChild(opponentsHeader);
  let opponentsMove = document.createElement("p");
  opponentsMove.classList.add("opponents-move");
  opponentsResultModal.appendChild(opponentsMove);
  return opponentsResultModal;
}

function updateOpponentsResult() {
  if (!lastMove) {
    document.querySelector(".opponents-move").textContent = "No move made";
  } else {
    document.querySelector(".opponents-move").textContent = `${lastMove}`;
  }
}

let nextBiggestComputerTarget = 5;
async function computerAttack() {
  //create modal that tells the human player the computer is attacking
  //the attacking message changes to result when computer is finished...
  //so i'd think the we use an async  function that changes the message when the attack is complete
  let computerAttackingModal = document.createElement("section");
  computerAttackingModal.classList.add("computer-attacking-modal");
  let computerAttackingModalHeader = document.createElement("h2");
  computerAttackingModalHeader.textContent = "Computers Turn";
  computerAttackingModal.appendChild(computerAttackingModalHeader);
  let computerAttackingModalText = document.createElement("p");
  computerAttackingModalText.textContent = "Attacking";
  computerAttackingModalText.classList.add("computer-attacking-modal-text");
  //maybe use an animation to add .'s after attacking
  computerAttackingModal.appendChild(computerAttackingModalText);

  //remember to have the computer look at where it hit an attack and try to make an educated guess where to attack now
  //maybe some kind of shortest path algo?
  //
  //moving on with just making my own algo:
  //
  //if no previous attacks made, randomly attack
  //else if a previous attack was a hit try any neighboring spot that hasn't been attempted
  //      if any pattern shows up, like vertical or horizontal, keep attacking until a miss or 5 hits in a row have been recorded because 5 is the biggest ship, unless of course the biggest ship is already sunk then adjust to next biggest ship... so create a variable nextBiggest which starts at 5 until the biggest is sunk, probably a better way to do it but yeah.
  //    not sure how to program it to tell it if hitting verticals keep attacking verticals, else horizontals
  // let attackingSea = gameState.players[0].gameboard.sea;
  // console.log(attackingSea);
  //
  //
  //
  //update lastMove with computers attack
  async function calculatedComputerAttack() {
    let attackingSea = await gameState.players[0].gameboard.sea.map((row) =>
      row.map((spot) => {
        if (typeof spot === "number") {
          return " ";
        } else {
          return spot;
        }
      })
    );
    console.log(attackingSea);
  }
  calculatedComputerAttack();
}

//
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

//
//
//
//
//
//when creating listeners on attack board, remember that the same classes are on spans in the seaKey, so target only those elements in that seaBoard element

//
//on the event listeners for attacking, maybe add a class to the span clicked with some kind of styling that makes it stick out, pop up a modal that verfies their selection with a yes and no button
