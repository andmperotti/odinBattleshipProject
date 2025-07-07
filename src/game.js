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
let turnCount = 1;
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
  //variables for storing game boards to
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

    //async listener function as computer attacks is await'ed
    confirmAttackButton.addEventListener("click", async () => {
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
        lastMove = `Attack was a miss at ${attackLocationArray[0]},${attackLocationArray[1]}`;
      } else if (
        gameState.defendingPlayer.gameboard.sea[attackLocationArray[0]][
          attackLocationArray[1]
        ] === "+"
      ) {
        lastMove = `Attack hit a ship at ${attackLocationArray[0]},${attackLocationArray[1]}`;
      }

      verifyAttackModal.remove();

      //call switch player if 2 humans playing otherwise have the computer attack and render new attackModal, maybe show a result modal in between, and a loading element, maybe even draw the modal, and display a loading message which dynamically turns in the result when the computer has finished attacking and then render the button for the player to move on to attack the computer
      if (gameState.players[1].type === "human") {
        turnCount++;
        switchPlayer();
      } else {
        turnCount++;
        attackModal.remove();

        //computer attacks, needs to be awaited... not sure how in a conditional block
        await computerAttack();
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

async function computerAttack() {
  //create modal that tells the human player the computer is attacking
  isModalActive = true;

  let computerAttackingModal = document.createElement("section");
  computerAttackingModal.classList.add("computer-attacking-modal");
  let computerAttackingModalHeader = document.createElement("h2");
  computerAttackingModalHeader.textContent = "Computers Turn";
  computerAttackingModal.appendChild(computerAttackingModalHeader);
  let computerAttackingModalText = document.createElement("p");
  computerAttackingModalText.textContent = "Attacking";
  computerAttackingModal.appendChild(computerAttackingModalText);
  let userVerifyComputerAttack = document.createElement("button");
  userVerifyComputerAttack.type = "button";
  userVerifyComputerAttack.textContent = "Advance to turn";
  userVerifyComputerAttack.classList.add("confirm-computer-result");
  computerAttackingModal.appendChild(userVerifyComputerAttack);
  body.appendChild(computerAttackingModal);

  //remember to have the computer look at where it hit an attack and try to make an educated guess where to attack now
  //heightened predictive attack, not finished
  // await calculatedComputerAttack();

  //random computer attacks
  await computerRandomlyAttacks();
  //random until hit, then attack adjacent sea spots around hits, then repeats:
  computerAttackingModalText.textContent = `${lastMove}`;

  userVerifyComputerAttack.addEventListener("click", () => {
    computerAttackingModal.remove();
    isModalActive = false;
  });
}

//function for computer to randomly attack board
async function computerRandomlyAttacks() {
  //filter opponents sea board
  let attackingSea = await gameState.players[0].gameboard.sea.map((row) =>
    row.map((spot) => {
      if (typeof spot === "number") {
        return " ";
      } else {
        return spot;
      }
    })
  );
  //variable that lets us recall if the computer has made an attack
  let computerAttacked = false;

  //randomly select a location on the opponents sea board
  //if it has not been attacked, attack it, and change computerAttacked to true
  while (!computerAttacked) {
    let randomY = Math.floor(Math.random() * 10);
    let randomX = Math.floor(Math.random() * 10);
    if (
      //if seaspot does not contain a hit or miss then attack that sea spot
      attackingSea[randomY][randomX] !== "-" ||
      attackingSea[randomY][randomX] !== "+"
    ) {
      await gameState.players[0].gameboard.receiveAttack(randomY, randomX);
      if (gameState.players[0].gameboard.sea[randomY][randomX] === "-") {
        //if the attack resulted in a miss, then save that to lastMove
        lastMove = `Computer's attack was a miss at ${randomY},${randomX}`;
      } else if (gameState.players[0].gameboard.sea[randomY][randomX] === "+") {
        //if the attack resulted in hitting a ship then save that to lastMove
        lastMove = `Computer's attack hit a ship at ${randomY},${randomX}`;
      }
      computerAttacked = true;
      console.log(`computer attacked at ${randomY},${randomX}`);
    }
  }
}
