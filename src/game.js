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
//variables for game progress purposes:
let gameInstance = false;
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
    gameState = true;
    let playerOneName = document.querySelector("#player-one-name").value;
    let playerTwoName = document.querySelector("#player-two-name").value;
    let playerTwoType = document.querySelector(
      // eslint-disable-next-line prettier/prettier
      "#player-two-type input:checked"
    ).value;
    gameInstance = new Game(playerOneName, playerTwoName, playerTwoType);

    //call function to hide startGameModal, followed by the function to clear that modals input values
    startGameModal.remove();

    //invoke method that allows players to place ships, or automatically assign ships
    placeShips();
  });
}
//display game start modal when there is not a current game running. At load there is no gameInstance therefore the startGameModal shows
function newGameShowHide() {
  if (!gameInstance) {
    newGameModal();
  }
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
  attackHeader.textContent = `Player ${gameInstance.attackingPlayer.name}'s Attack Screen:`;
  attackHeader.classList.add("attack-header");
  attackModal.appendChild(attackHeader);
  //show opponents sea, convert elements to display things other than numbers: blue background with a space or underscore for a not attacked sea-spot, yellow background with a '-' for a miss, and green background color with a '+' for a hit.
  attackBoard = buildSeaBoard(gameInstance.defendingPlayer);
  let attackBoardHolder = document.createElement("section");
  attackBoardHolder.appendChild(attackBoard);
  attackBoardHolder.classList.add("attack-board-holder");
  attackModal.appendChild(attackBoardHolder);

  attackModal.appendChild(buildSeaKey());

  let defendingHeader = document.createElement("h2");
  defendingHeader.classList.add("defending-header");
  defendingHeader.textContent = `Player ${gameInstance.attackingPlayer.name}'s Defense Screen:`;
  attackModal.appendChild(defendingHeader);
  defenseBoard = buildSeaBoard(gameInstance.attackingPlayer);
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
  let attackerBoatCount = gameInstance.attackingPlayer.gameboard.boats.filter(
    // eslint-disable-next-line prettier/prettier
    (boat) => boat.sunk !== true
  ).length;
  attackerBoatsRemaining.textContent = `Your Ships left: ${attackerBoatCount} `;
  attackModal.appendChild(attackerBoatsRemaining);

  let defenseBoatsRemaining =
    gameInstance.defendingPlayer.gameboard.boats.filter(
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
      await gameInstance.defendingPlayer.gameboard.receiveAttack(
        attackLocationArray[0],
        // eslint-disable-next-line prettier/prettier
        attackLocationArray[1]
      );

      //conditional to build result string, if spot attacked is now a - then miss, if + then hit, update lastMove here
      if (
        gameInstance.defendingPlayer.gameboard.sea[attackLocationArray[0]][
          attackLocationArray[1]
        ] === "-"
      ) {
        lastMove = `${gameInstance.attackingPlayer.name}'s attack was a miss at ${attackLocationArray[0]},${attackLocationArray[1]}`;
      } else if (
        gameInstance.defendingPlayer.gameboard.sea[attackLocationArray[0]][
          attackLocationArray[1]
        ] === "+"
      ) {
        lastMove = `${gameInstance.attackingPlayer.name}'s attack hit a ship at ${attackLocationArray[0]},${attackLocationArray[1]}`;
      }

      verifyAttackModal.remove();

      //game driving loop
      //if there are 2 human players
      if (gameInstance.players[1].type === "human") {
        gameEndCheck();
        //if game is not over
        if (gameState) {
          turnCount++;
          attackModal.remove();
          await switchPlayer();
          buildAttackModal();
          //else if game is not over
        } else {
          attackModal.remove();
        }
        //else player2 is computer
      } else {
        gameEndCheck();
        //if game is not over
        if (gameState) {
          turnCount++;
          attackModal.remove();
          await computerAttack();
          gameEndCheck();
          //if computer attack has not finished the game
          if (gameState) {
            buildAttackModal();
          }
          //else if the computer attack did finish the game
        } else {
          attackModal.remove();
        }
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
        if (isModalActive !== true) {
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
  return new Promise((resolve) => {
    if (isModalActive === false) {
      isModalActive = true;
      let switchPlayerModal = document.createElement("div");
      switchPlayerModal.id = "switch-player-modal";
      let contextSwitch = document.createElement("h2");
      contextSwitch.textContent = "Switch Player";
      switchPlayerModal.appendChild(contextSwitch);
      // updateOpponentsResult();
      let resultText = document.createElement("p");
      resultText.textContent = `${lastMove}`;
      switchPlayerModal.appendChild(resultText);
      let switchPlayerButton = document.createElement("button");
      switchPlayerButton.type = "button";
      switchPlayerButton.textContent = "Switch";
      switchPlayerButton.id = "switch-player-button";
      switchPlayerModal.appendChild(switchPlayerButton);
      body.appendChild(switchPlayerModal);
      switchPlayerModal.style.display = "grid";
      let switchPlayerNotice = document.createElement("p");
      switchPlayerNotice.innerHTML = `Please give the computer to: <span class='player-name'>${gameInstance.defendingPlayer.name}</span>`;
      switchPlayerModal.appendChild(switchPlayerNotice);

      switchPlayerButton.addEventListener("click", () => {
        isModalActive = false;
        gameInstance.switchPlayers();
        switchPlayerModal.remove();
        resolve(true);
      });
    }
  });
}

function buildSeaBoard(player) {
  //what if we build a modal for each player that had their sea board to show their opponents moves on their board, and a board with their attacks results displayed, and each time we switch player the modal shown switches, and of course listeners will be on different elements

  //build board for showing attacking players own sea
  if (player === gameInstance.attackingPlayer) {
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
          seaSpot.classList.add("placed-ship");
          if (seaSpot.textContent === "1") {
            seaSpot.classList.add("carrier-spot");
          } else if (seaSpot.textContent === "2") {
            seaSpot.classList.add("battleship-spot");
          } else if (seaSpot.textContent === "3") {
            seaSpot.classList.add("destroyer-spot");
          } else if (seaSpot.textContent === "4") {
            seaSpot.classList.add("submarine-spot");
          } else if (seaSpot.textContent === "5") {
            seaSpot.classList.add("patrol-boat-spot");
          }
        }
        seaRow.appendChild(seaSpot);
      }
    }
    return seaBoard;
    //build board for showing attack sea, aka converted defenders sea board
  } else if (player === gameInstance.defendingPlayer) {
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
    document.querySelector(".opponents-move").textContent = "No moves yet";
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

  //random computer attack:
  // await computerRandomlyAttacks();

  //more concerted computer attack:
  await computerTargetedAttack();
  computerAttackingModalText.textContent = `${lastMove}`;

  userVerifyComputerAttack.addEventListener("click", () => {
    computerAttackingModal.remove();
    isModalActive = false;
  });
}

//function for computer to randomly attack board
async function computerRandomlyAttacks() {
  //filter opponents sea board
  let attackingSea = await gameInstance.players[0].gameboard.sea.map((row) =>
    row.map((spot) => {
      if (typeof spot === "number") {
        return " ";
      } else {
        return spot;
      }
      // eslint-disable-next-line prettier/prettier
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
      //if sea spot does not contain a hit or miss then attack that sea spot
      attackingSea[randomY][randomX] === " "
    ) {
      await gameInstance.players[0].gameboard.receiveAttack(randomY, randomX);
      if (gameInstance.players[0].gameboard.sea[randomY][randomX] === "-") {
        //if the attack resulted in a miss, then save that to lastMove
        lastMove = `Computer's attack was a miss at ${randomY},${randomX}`;
      } else if (
        gameInstance.players[0].gameboard.sea[randomY][randomX] === "+"
      ) {
        //if the attack resulted in hitting a ship then save that to lastMove
        lastMove = `Computer's attack hit a ship at ${randomY},${randomX}`;
      }
      computerAttacked = true;
      return true;
    }
  }
}

async function computerTargetedAttack() {
  //first off if there are no previous hits, attack randomly
  let attackingSea = await gameInstance.players[0].gameboard.sea.map((row) =>
    row.map((spot) => {
      if (typeof spot === "number") {
        return " ";
      } else {
        return spot;
      }
      // eslint-disable-next-line prettier/prettier
    })
  );
  //if there aren't any hits in the sea, then call computer randomly attacks function
  if (
    attackingSea.reduce(
      (acc, cur) => acc + cur.filter((spot) => spot === "+").length,
      0
    ) < 1
  ) {
    await computerRandomlyAttacks();
  } else {
    //otherwise make an attack at a sea spot around a previous hit that hasn't been attacked
    //iterate through sea, check for adjacent spot around hit, if found attack, otherwise keep iterating to hits and checking spots, if no empty adjacent sea spot found then attack randomly
    let computerAttacked = false;
    //iterate over human player filtered sea looking for a hit
    for (let row = 0; row < attackingSea.length; row++) {
      for (let spot = 0; spot < 10; spot++) {
        //if iterated sea spot contains a hit
        if (attackingSea[row][spot] === "+") {
          //if the next spot in the row is a valid location, and empty attack it
          if (spot + 1 <= 9 && attackingSea[row][spot + 1] === " ") {
            await gameInstance.players[0].gameboard.receiveAttack(
              row,
              spot + 1
            );
            //update lastMove dynamically depending on result of attack
            if (gameInstance.players[0].gameboard.sea[row][spot + 1] === "-") {
              //if the attack resulted in a miss, then save that to lastMove
              lastMove = `Computer's attack was a miss at ${row},${spot + 1}`;
            } else if (
              gameInstance.players[0].gameboard.sea[row][spot + 1] === "+"
            ) {
              //if the attack resulted in hitting a ship then save that to lastMove
              lastMove = `Computer's attack hit a ship at ${row},${spot + 1}`;
            }
            computerAttacked = true;
            return true;
            //if the spot in the below row is empty attack it
          } else if (row + 1 <= 9 && attackingSea[row + 1][spot] === " ") {
            await gameInstance.players[0].gameboard.receiveAttack(
              row + 1,
              spot
            );
            //update lastMove dynamically depending on result of attack
            if (gameInstance.players[0].gameboard.sea[row + 1][spot] === "-") {
              //if the attack resulted in a miss, then save that to lastMove
              lastMove = `Computer's attack was a miss at ${row},${spot + 1}`;
            } else if (
              gameInstance.players[0].gameboard.sea[row + 1][spot] === "+"
            ) {
              //if the attack resulted in hitting a ship then save that to lastMove
              lastMove = `Computer's attack hit a ship at ${row + 1},${spot}`;
            }
            computerAttacked = true;
            return true;
            //if the previous spot in the row is empty attack it
          } else if (spot - 1 >= 0 && attackingSea[row][spot - 1] === " ") {
            await gameInstance.players[0].gameboard.receiveAttack(
              row,
              spot - 1
            );
            if (gameInstance.players[0].gameboard.sea[row][spot - 1] === "-") {
              //if the attack resulted in a miss, then save that to lastMove
              lastMove = `Computer's attack was a miss at ${row},${spot - 1}`;
            } else if (
              gameInstance.players[0].gameboard.sea[row][spot - 1] === "+"
            ) {
              //if the attack resulted in hitting a ship then save that to lastMove
              lastMove = `Computer's attack hit a ship at ${row},${spot - 1}`;
            }
            computerAttacked = true;
            return true;
            //if the previous row spot is empty attack it
          } else if (row - 1 >= 0 && attackingSea[row - 1][spot] === " ") {
            await gameInstance.players[0].gameboard.receiveAttack(
              row - 1,
              spot
            );
            if (gameInstance.players[0].gameboard.sea[row - 1][spot] === "-") {
              //if the attack resulted in a miss, then save that to lastMove
              lastMove = `Computer's attack was a miss at ${row},${spot + 1}`;
            } else if (
              gameInstance.players[0].gameboard.sea[row - 1][spot] === "+"
            ) {
              //if the attack resulted in hitting a ship then save that to lastMove
              lastMove = `Computer's attack hit a ship at ${row - 1},${spot}`;
            }
            computerAttacked = true;
            return true;
          }
        }
      }
    }
    //if no computer attack made after iterating, then randomly attack
    if (!computerAttacked) {
      await computerRandomlyAttacks();
      computerAttacked = true;
      return true;
    }
  }
}

function gameEndCheck() {
  //if either player has no boats remaining, remove all modals and generate winnerBoard

  if (
    gameInstance.players[0].gameboard.boats.filter((boat) => !boat.sunk)
      .length === 0
  ) {
    gameState = false;
    //game over player 2 wins
    gameOver(gameInstance.players[0], gameInstance.players[1]);
  } else if (
    gameInstance.players[1].gameboard.boats.filter((boat) => !boat.sunk)
      .length === 0
  ) {
    gameState = false;
    //game over player 1 wins
    gameOver(gameInstance.players[1], gameInstance.players[0]);
  }
}

function gameOver(winner, loser) {
  let winSummary = document.createElement("section");
  let winSummaryHeader = document.createElement("h2");
  winSummaryHeader.textContent = `${winner.name} has beaten ${loser.name}`;
  winSummary.appendChild(winSummaryHeader);
  let boardSummary = document.createElement("section");
  let playerOneHeader = document.createElement("h3");
  playerOneHeader.classList.add("player-one-summary-header");
  playerOneHeader.textContent = `${gameInstance.players[0].name}'s board:`;
  boardSummary.appendChild(playerOneHeader);
  let playerTwoHeader = document.createElement("h3");
  playerTwoHeader.classList.add("player-two-summary-header");
  playerTwoHeader.textContent = `${gameInstance.players[1].name}'s board:`;
  boardSummary.appendChild(playerTwoHeader);
  let playerOneFinalBoard = buildFinalSeaBoard(gameInstance.players[0]);
  winSummary.classList.add("win-summary");
  boardSummary.appendChild(playerOneFinalBoard);

  boardSummary.classList.add("board-summary");
  winSummary.appendChild(boardSummary);
  let finalTurnCount = document.createElement("h4");
  finalTurnCount.textContent = `Turns: ${turnCount}`;
  boardSummary.appendChild(finalTurnCount);
  finalTurnCount.classList.add("final-turn-count");
  let boardSummaryKey = buildSeaKey();
  boardSummary.appendChild(boardSummaryKey);
  let playerTwoFinalBoard = buildFinalSeaBoard(gameInstance.players[1]);
  boardSummary.appendChild(playerTwoFinalBoard);
  playerTwoFinalBoard.classList.add("attack-sea-board");
  playerTwoFinalBoard.classList.remove("defense-sea-board");
  winSummary.appendChild(boardSummary);

  let newGameButton = document.createElement("button");
  newGameButton.textContent = "Start New Game";
  newGameButton.type = "button";
  winSummary.appendChild(newGameButton);

  newGameButton.addEventListener("click", () => {
    winSummary.remove();
    //wipe variables
    gameInstance = false;
    gameState = false;
    lastMove;
    turnCount = 1;
    isModalActive = false;
    //invoke new game modal
    newGameShowHide();
  });

  body.appendChild(winSummary);
}

function buildFinalSeaBoard(player) {
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
      if (player.gameboard.sea[i][j] === 0) {
        seaSpot.textContent = " ";
        seaSpot.classList.add("not-attacked");
      } else if (player.gameboard.sea[i][j] === "+") {
        seaSpot.textContent = "+";
        seaSpot.classList.add("successful-attack");
      } else if (player.gameboard.sea[i][j] === "-") {
        seaSpot.textContent = "-";
        seaSpot.classList.add("unsuccessful-attack");
        //else if the spot was never attacked and is occupied with a ship
      } else {
        seaSpot.textContent = player.gameboard.sea[i][j];
        seaSpot.classList.add("not-attacked");
      }
      seaRow.appendChild(seaSpot);
    }
  }
  return seaBoard;
}

async function placeShips() {
  //will need logic to have one player or both human players to place ships
  //await player one being done?
  let firstPlayerPlacement = await placeShipsModal(
    gameInstance.attackingPlayer
  );
  lastMove = `${gameInstance.attackingPlayer.name} placed ships`;
  if (firstPlayerPlacement && gameInstance.players[1].type === "human") {
    //remove first placer placeShipsUI
    document.querySelector(".place-ships-ui").remove();
    //switch players
    //modal tell them to switch players:
    await switchPlayer();
    await placeShipsModal(gameInstance.attackingPlayer);
    document.querySelector(".place-ships-ui").remove();

    lastMove = `${gameInstance.attackingPlayer.name} placed ships`;

    //await player finalizing their ship placements
    //start attacking loop logic via building attack modal:
    await switchPlayer();
    buildAttackModal();
  } else if (
    gameInstance.players[1].type === "computer" &&
    firstPlayerPlacement
  ) {
    document.querySelector(".place-ships-ui").remove();
    //function to have computer place its ships randomly
    randomlyPlaceShips(gameInstance.players[1]);

    buildAttackModal(); //does show up, just doesn't allow for attacks
  }
}

async function placeShipsModal(player) {
  return new Promise((resolve) => {
    let placeShipsUI = document.createElement("div");
    placeShipsUI.classList.add("place-ships-ui");
    body.appendChild(placeShipsUI);
    let placeShipsUIHeader = document.createElement("h3");
    placeShipsUIHeader.textContent = `${player.name} place your ships`;
    placeShipsUIHeader.classList.add("place-ships-ui-header");
    placeShipsUI.appendChild(placeShipsUIHeader);
    let userSeaPlacer = buildSeaBoard(gameInstance.attackingPlayer);
    userSeaPlacer.classList.add("user-sea-placer");
    placeShipsUI.appendChild(userSeaPlacer);

    let randomPlacementButton = document.createElement("button");
    randomPlacementButton.type = "button";
    randomPlacementButton.textContent = "Randomly Place Ships";
    randomPlacementButton.id = "randomly-place-ships-button";
    placeShipsUI.appendChild(randomPlacementButton);

    let shipPlaceTable = document.createElement("table");
    shipPlaceTable.classList.add("ship-place-table");
    let shipPlaceTableHeaderRow = document.createElement("tr");
    let shipPlaceKey = document.createElement("th");
    shipPlaceKey.textContent = "Boat #";
    shipPlaceTableHeaderRow.appendChild(shipPlaceKey);
    let boatType = document.createElement("th");
    boatType.textContent = "Boat Type:";
    shipPlaceTableHeaderRow.appendChild(boatType);
    let boatYInput = document.createElement("th");
    boatYInput.textContent = "Row (Y):";
    shipPlaceTableHeaderRow.appendChild(boatYInput);
    let boatXInput = document.createElement("th");
    boatXInput.textContent = "Column (X):";
    shipPlaceTableHeaderRow.appendChild(boatXInput);
    let boatOrientation = document.createElement("th");
    boatOrientation.textContent = "Orientation:";
    shipPlaceTableHeaderRow.appendChild(boatOrientation);
    let boatAddReplaceHeader = document.createElement("th");
    boatAddReplaceHeader.textContent = "Add / Replace";
    shipPlaceTableHeaderRow.appendChild(boatAddReplaceHeader);
    shipPlaceTable.appendChild(shipPlaceTableHeaderRow);

    let carrierRow = document.createElement("tr");
    carrierRow.classList.add("carrier-row");
    shipPlaceTable.appendChild(carrierRow);
    let carrierNumber = document.createElement("td");
    carrierNumber.textContent = "1";
    carrierRow.appendChild(carrierNumber);
    let carrierType = document.createElement("td");
    carrierType.textContent = "Carrier";
    carrierRow.appendChild(carrierType);
    let carrierY = document.createElement("td");
    let carrierYInput = document.createElement("input");
    carrierYInput.type = "number";
    carrierYInput.min = 1;
    carrierYInput.max = 10;
    carrierYInput.id = "carrier-y-input";
    carrierYInput.classList.add("table-input");
    carrierY.appendChild(carrierYInput);
    carrierRow.appendChild(carrierY);
    let carrierX = document.createElement("td");
    let carrierXInput = document.createElement("input");
    carrierXInput.type = "number";
    carrierXInput.min = 1;
    carrierXInput.max = 10;
    carrierXInput.id = "carrier-x-input";
    carrierXInput.classList.add("table-input");
    carrierX.appendChild(carrierXInput);
    carrierRow.appendChild(carrierX);
    let carrierOrientation = document.createElement("td");
    carrierRow.appendChild(carrierOrientation);
    let carrierOrientationInput = document.createElement("select");
    carrierOrientationInput.id = "carrier-orientation";
    carrierOrientation.appendChild(carrierOrientationInput);
    let chooseCarrierOrientation = document.createElement("option");
    chooseCarrierOrientation.textContent = "Choose";
    carrierOrientationInput.appendChild(chooseCarrierOrientation);
    let carrierUpOrientation = document.createElement("option");
    carrierUpOrientation.value = "up";
    carrierUpOrientation.textContent = "up";
    carrierOrientationInput.appendChild(carrierUpOrientation);
    let carrierDownOrientation = document.createElement("option");
    carrierDownOrientation.value = "down";
    carrierDownOrientation.textContent = "down";
    carrierOrientationInput.appendChild(carrierDownOrientation);
    let carrierLeftOrientation = document.createElement("option");
    carrierLeftOrientation.value = "left";
    carrierLeftOrientation.textContent = "left";
    carrierOrientationInput.appendChild(carrierLeftOrientation);
    let carrierRightOrientation = document.createElement("option");
    carrierRightOrientation.value = "right";
    carrierRightOrientation.textContent = "right";
    carrierOrientationInput.appendChild(carrierRightOrientation);
    let carrierAddReplace = document.createElement("td");
    carrierRow.appendChild(carrierAddReplace);
    let carrierAddReplaceButton = document.createElement("button");
    carrierAddReplaceButton.type = "button";
    carrierAddReplaceButton.textContent = "+ / -";
    carrierAddReplaceButton.id = "add-replace-carrier";
    carrierAddReplace.appendChild(carrierAddReplaceButton);

    let battleshipRow = document.createElement("tr");
    battleshipRow.classList.add("battleship-row");
    shipPlaceTable.appendChild(battleshipRow);
    let battleshipNumber = document.createElement("td");
    battleshipNumber.textContent = "2";
    battleshipRow.appendChild(battleshipNumber);
    let battleshipType = document.createElement("td");
    battleshipType.textContent = "Battleship";
    battleshipRow.appendChild(battleshipType);
    let battleshipY = document.createElement("td");
    let battleshipYInput = document.createElement("input");
    battleshipYInput.type = "number";
    battleshipYInput.min = 1;
    battleshipYInput.max = 10;
    battleshipYInput.id = "battleship-y-input";
    battleshipYInput.classList.add("table-input");
    battleshipY.appendChild(battleshipYInput);
    battleshipRow.appendChild(battleshipY);
    let battleshipX = document.createElement("td");
    let battleshipXInput = document.createElement("input");
    battleshipXInput.type = "number";
    battleshipXInput.min = 1;
    battleshipXInput.max = 10;
    battleshipXInput.id = "battleship-x-input";
    battleshipXInput.classList.add("table-input");
    battleshipX.appendChild(battleshipXInput);
    battleshipRow.appendChild(battleshipX);
    let battleshipOrientation = document.createElement("td");
    battleshipRow.appendChild(battleshipOrientation);
    let battleshipOrientationInput = document.createElement("select");
    battleshipOrientationInput.id = "battle-orientation";
    battleshipOrientation.appendChild(battleshipOrientationInput);
    let chooseBattleshipOrientation = document.createElement("option");
    chooseBattleshipOrientation.textContent = "Choose";
    battleshipOrientationInput.appendChild(chooseBattleshipOrientation);
    let battleshipUpOrientation = document.createElement("option");
    battleshipUpOrientation.value = "up";
    battleshipUpOrientation.textContent = "up";
    battleshipOrientationInput.appendChild(battleshipUpOrientation);
    let battleshipDownOrientation = document.createElement("option");
    battleshipDownOrientation.value = "down";
    battleshipDownOrientation.textContent = "down";
    battleshipOrientationInput.appendChild(battleshipDownOrientation);
    let battleshipLeftOrientation = document.createElement("option");
    battleshipLeftOrientation.value = "left";
    battleshipLeftOrientation.textContent = "left";
    battleshipOrientationInput.appendChild(battleshipLeftOrientation);
    let battleshipRightOrientation = document.createElement("option");
    battleshipRightOrientation.value = "right";
    battleshipRightOrientation.textContent = "right";
    battleshipOrientationInput.appendChild(battleshipRightOrientation);
    let battleshipAddReplace = document.createElement("td");
    battleshipRow.appendChild(battleshipAddReplace);
    let battleshipAddReplaceButton = document.createElement("button");
    battleshipAddReplaceButton.type = "button";
    battleshipAddReplaceButton.textContent = "+ / -";
    battleshipAddReplaceButton.id = "add-replace-battleship";
    battleshipAddReplace.appendChild(battleshipAddReplaceButton);

    let destroyerRow = document.createElement("tr");
    destroyerRow.classList.add("destroyer-row");
    shipPlaceTable.appendChild(destroyerRow);
    let destroyerNumber = document.createElement("td");
    destroyerNumber.textContent = "3";
    destroyerRow.appendChild(destroyerNumber);
    let destroyerType = document.createElement("td");
    destroyerType.textContent = "Destroyer";
    destroyerRow.appendChild(destroyerType);
    let destroyerY = document.createElement("td");
    let destroyerYInput = document.createElement("input");
    destroyerYInput.type = "number";
    destroyerYInput.min = 1;
    destroyerYInput.max = 10;
    destroyerYInput.id = "destroyer-y-input";
    destroyerYInput.classList.add("table-input");
    destroyerY.appendChild(destroyerYInput);
    destroyerRow.appendChild(destroyerY);
    let destroyerX = document.createElement("td");
    let destroyerXInput = document.createElement("input");
    destroyerXInput.type = "number";
    destroyerXInput.min = 1;
    destroyerXInput.max = 10;
    destroyerXInput.id = "destroyer-x-input";
    destroyerXInput.classList.add("table-input");
    destroyerX.appendChild(destroyerXInput);
    destroyerRow.appendChild(destroyerX);
    let destroyerOrientation = document.createElement("td");
    destroyerRow.appendChild(destroyerOrientation);
    let destroyerOrientationInput = document.createElement("select");
    destroyerOrientationInput.id = "destroyer-orientation";
    destroyerOrientation.appendChild(destroyerOrientationInput);
    let chooseDestroyerOrientation = document.createElement("option");
    chooseDestroyerOrientation.textContent = "Choose";
    destroyerOrientationInput.appendChild(chooseDestroyerOrientation);
    let destroyerUpOrientation = document.createElement("option");
    destroyerUpOrientation.value = "up";
    destroyerUpOrientation.textContent = "up";
    destroyerOrientationInput.appendChild(destroyerUpOrientation);
    let destroyerDownOrientation = document.createElement("option");
    destroyerDownOrientation.value = "down";
    destroyerDownOrientation.textContent = "down";
    destroyerOrientationInput.appendChild(destroyerDownOrientation);
    let destroyerLeftOrientation = document.createElement("option");
    destroyerLeftOrientation.value = "left";
    destroyerLeftOrientation.textContent = "left";
    destroyerOrientationInput.appendChild(destroyerLeftOrientation);
    let destroyerRightOrientation = document.createElement("option");
    destroyerRightOrientation.value = "right";
    destroyerRightOrientation.textContent = "right";
    destroyerOrientationInput.appendChild(destroyerRightOrientation);
    let destroyerAddReplace = document.createElement("td");
    destroyerRow.appendChild(destroyerAddReplace);
    let destroyerAddReplaceButton = document.createElement("button");
    destroyerAddReplaceButton.type = "button";
    destroyerAddReplaceButton.textContent = "+ / -";
    destroyerAddReplaceButton.id = "add-replace-destroyer";
    destroyerAddReplace.appendChild(destroyerAddReplaceButton);

    let submarineRow = document.createElement("tr");
    submarineRow.classList.add("submarine-row");
    shipPlaceTable.appendChild(submarineRow);
    let submarineNumber = document.createElement("td");
    submarineNumber.textContent = "4";
    submarineRow.appendChild(submarineNumber);
    let submarineType = document.createElement("td");
    submarineType.textContent = "Submarine";
    submarineRow.appendChild(submarineType);
    let submarineY = document.createElement("td");
    let submarineYInput = document.createElement("input");
    submarineYInput.type = "number";
    submarineYInput.min = 1;
    submarineYInput.max = 10;
    submarineYInput.id = "submarine-y-input";
    submarineYInput.classList.add("table-input");
    submarineY.appendChild(submarineYInput);
    submarineRow.appendChild(submarineY);
    let submarineX = document.createElement("td");
    let submarineXInput = document.createElement("input");
    submarineXInput.type = "number";
    submarineXInput.min = 1;
    submarineXInput.max = 10;
    submarineXInput.id = "submarine-x-input";
    submarineXInput.classList.add("table-input");
    submarineX.appendChild(submarineXInput);
    submarineRow.appendChild(submarineX);
    let submarineOrientation = document.createElement("td");
    submarineRow.appendChild(submarineOrientation);
    let submarineOrientationInput = document.createElement("select");
    submarineOrientationInput.id = "submarine-orientation";
    submarineOrientation.appendChild(submarineOrientationInput);
    let chooseSubmarineOrientation = document.createElement("option");
    chooseSubmarineOrientation.textContent = "Choose";
    submarineOrientationInput.appendChild(chooseSubmarineOrientation);
    let submarineUpOrientation = document.createElement("option");
    submarineUpOrientation.value = "up";
    submarineUpOrientation.textContent = "up";
    submarineOrientationInput.appendChild(submarineUpOrientation);
    let submarineDownOrientation = document.createElement("option");
    submarineDownOrientation.value = "down";
    submarineDownOrientation.textContent = "down";
    submarineOrientationInput.appendChild(submarineDownOrientation);
    let submarineLeftOrientation = document.createElement("option");
    submarineLeftOrientation.value = "left";
    submarineLeftOrientation.textContent = "left";
    submarineOrientationInput.appendChild(submarineLeftOrientation);
    let submarineRightOrientation = document.createElement("option");
    submarineRightOrientation.value = "right";
    submarineRightOrientation.textContent = "right";
    submarineOrientationInput.appendChild(submarineRightOrientation);
    let submarineAddReplace = document.createElement("td");
    submarineRow.appendChild(submarineAddReplace);
    let submarineAddReplaceButton = document.createElement("button");
    submarineAddReplaceButton.type = "button";
    submarineAddReplaceButton.textContent = "+ / -";
    submarineAddReplaceButton.id = "add-replace-submarine";
    submarineAddReplace.appendChild(submarineAddReplaceButton);

    let patrolBoatRow = document.createElement("tr");
    patrolBoatRow.classList.add("patrol-boat-row");
    shipPlaceTable.appendChild(patrolBoatRow);
    let patrolBoatNumber = document.createElement("td");
    patrolBoatNumber.textContent = "5";
    patrolBoatRow.appendChild(patrolBoatNumber);
    let patrolBoatType = document.createElement("td");
    patrolBoatType.textContent = "Patrol Boat";
    patrolBoatRow.appendChild(patrolBoatType);
    let patrolBoatY = document.createElement("td");
    let patrolBoatYInput = document.createElement("input");
    patrolBoatYInput.type = "number";
    patrolBoatYInput.min = 1;
    patrolBoatYInput.max = 10;
    patrolBoatYInput.id = "patrolBoat-y-input";
    patrolBoatYInput.classList.add("table-input");
    patrolBoatY.appendChild(patrolBoatYInput);
    patrolBoatRow.appendChild(patrolBoatY);
    let patrolBoatX = document.createElement("td");
    let patrolBoatXInput = document.createElement("input");
    patrolBoatXInput.type = "number";
    patrolBoatXInput.min = 1;
    patrolBoatXInput.max = 10;
    patrolBoatXInput.id = "patrolBoat-x-input";
    patrolBoatXInput.classList.add("table-input");
    patrolBoatX.appendChild(patrolBoatXInput);
    patrolBoatRow.appendChild(patrolBoatX);
    let patrolBoatOrientation = document.createElement("td");
    patrolBoatRow.appendChild(patrolBoatOrientation);
    let patrolBoatOrientationInput = document.createElement("select");
    patrolBoatOrientationInput.id = "patrolBoat-orientation";
    patrolBoatOrientation.appendChild(patrolBoatOrientationInput);
    let choosePatrolBoatOrientation = document.createElement("option");
    choosePatrolBoatOrientation.textContent = "Choose";
    patrolBoatOrientationInput.appendChild(choosePatrolBoatOrientation);
    let patrolBoatUpOrientation = document.createElement("option");
    patrolBoatUpOrientation.value = "up";
    patrolBoatUpOrientation.textContent = "up";
    let patrolBoatDownOrientation = document.createElement("option");
    patrolBoatOrientationInput.appendChild(patrolBoatUpOrientation);
    patrolBoatDownOrientation.value = "down";
    patrolBoatDownOrientation.textContent = "down";
    patrolBoatOrientationInput.appendChild(patrolBoatDownOrientation);
    let patrolBoatLeftOrientation = document.createElement("option");
    patrolBoatLeftOrientation.value = "left";
    patrolBoatLeftOrientation.textContent = "left";
    patrolBoatOrientationInput.appendChild(patrolBoatLeftOrientation);
    let patrolBoatRightOrientation = document.createElement("option");
    patrolBoatRightOrientation.value = "right";
    patrolBoatRightOrientation.textContent = "right";
    patrolBoatOrientationInput.appendChild(patrolBoatRightOrientation);
    let patrolBoatAddReplace = document.createElement("td");
    patrolBoatRow.appendChild(patrolBoatAddReplace);
    let patrolBoatAddReplaceButton = document.createElement("button");
    patrolBoatAddReplaceButton.type = "button";
    patrolBoatAddReplaceButton.textContent = "+ / -";
    patrolBoatAddReplaceButton.id = "add-replace-patrolBoat";
    patrolBoatAddReplace.appendChild(patrolBoatAddReplaceButton);

    placeShipsUI.appendChild(shipPlaceTable);

    let placementButtonsContainer = document.createElement("section");
    placementButtonsContainer.id = "placement-buttons-container";
    let finalizePlacementsButton = document.createElement("button");
    finalizePlacementsButton.type = "button";
    finalizePlacementsButton.id = "confirm-placements-button";
    finalizePlacementsButton.textContent = "Finalize Placements";
    placementButtonsContainer.appendChild(finalizePlacementsButton);
    let clearPlacementsButton = document.createElement("button");
    clearPlacementsButton.type = "button";
    clearPlacementsButton.id = "clear-placements-button";
    clearPlacementsButton.textContent = "Clear Ships";
    placementButtonsContainer.appendChild(clearPlacementsButton);
    placeShipsUI.appendChild(placementButtonsContainer);

    //listeners for buttons

    finalizePlacementsButton.addEventListener("click", async () => {
      //prompt user to verify action, if they click finalize (true) then remove the placeships ui a, otherwise if they try to finalize their sea board and there are not enough ships in that players gameboard then for 3 seconds tell them their error
      let confirm = await verifyModal(
        "finalize sea board",
        `for player: ${gameInstance.attackingPlayer.name}`
      );
      //if the player clicks ok and has 5 boats
      if (
        confirm &&
        gameInstance.attackingPlayer.gameboard.boats.filter((boat) => boat.type)
          .length === 5
      ) {
        resolve(true);
      } else {
        //output error to span after table
        let boatLengthError = document.createElement("span");
        boatLengthError.classList.add("boat-length-error");
        boatLengthError.textContent = "Not enough ships created";
        shipPlaceTable.after(boatLengthError);

        setTimeout(() => {
          boatLengthError.remove();
        }, 3000);
      }
    });

    clearPlacementsButton.addEventListener("click", async () => {
      let confirm = await verifyModal(
        "clear all ships",
        `for player: ${gameInstance.attackingPlayer.name}`
      );
      if (confirm) {
        await gameInstance.attackingPlayer.gameboard.clearShips();
        //replace old displayed sea board with new sea board which is empty because user cleared their ships
        placeShipsUI.replaceChild(
          buildSeaBoard(gameInstance.attackingPlayer),
          document.querySelector(".user-sea-placer")
        );
        //add class to newly rendered sea board
        document
          .querySelector(".place-ships-ui .defense-sea-board")
          .classList.add("user-sea-placer");
      }
    });

    randomPlacementButton.addEventListener("click", async () => {
      let confirm = await verifyModal(
        "randomly place ships",
        `for player: ${gameInstance.attackingPlayer.name}`
      );
      if (confirm) {
        await gameInstance.attackingPlayer.gameboard.clearShips();
        randomlyPlaceShips(gameInstance.players[0]);

        //replace old sea board with new sea board generated after randomly placing ships
        placeShipsUI.replaceChild(
          buildSeaBoard(gameInstance.attackingPlayer),
          document.querySelector(".user-sea-placer")
        );
        //add class to newly rendered sea board
        document
          .querySelector(".place-ships-ui .defense-sea-board")
          .classList.add("user-sea-placer");
      }
    });

    //function that gets invoked when user places ship from ui
    async function addOrReplaceShip(specificShipRowButtonElement) {
      let typeOfBoat =
        specificShipRowButtonElement.parentElement.parentElement.childNodes[1].textContent.toLowerCase();
      //next 2 variables expressions end in -1 because users use 1 to 10 for placement but arrays index positions are 0-9
      let newShipY =
        specificShipRowButtonElement.parentElement.parentElement.childNodes[2]
          .childNodes[0].value - 1;
      let newShipX =
        specificShipRowButtonElement.parentElement.parentElement.childNodes[3]
          .childNodes[0].value - 1;
      let newShipOrientation =
        specificShipRowButtonElement.parentElement.parentElement.childNodes[4]
          .childNodes[0].value;
      let newShipLength;
      switch (typeOfBoat) {
        case "carrier":
          newShipLength = 5;
          break;
        case "battleship":
          newShipLength = 4;
          break;
        case "destroyer":
          newShipLength = 3;
          break;
        case "submarine":
          newShipLength = 3;
          break;
        case "patrol boat":
          newShipLength = 2;
          break;
      }
      //logic to figure out if user is placing or replacing a ship
      if (
        //if the type of boat doesn't exist in the boats array, and if the placement is allowed and not occupied, then place the boat
        gameInstance.attackingPlayer.gameboard.boats.filter(
          (boat) => boat.type === typeOfBoat
        ).length < 1
      ) {
        let placeShipResult =
          await gameInstance.attackingPlayer.gameboard.placeShip(
            newShipY,
            newShipX,
            newShipOrientation,
            newShipLength,
            typeOfBoat
          );
        if (placeShipResult === false) {
          inputVacancyErrorDisplay(typeOfBoat);
        }
      } else {
        //otherwise if there is a boat of this type, and the new ship is within the sea board and the sea spots are not occupied, replace the ship
        let replaceShipResult =
          await gameInstance.attackingPlayer.gameboard.replaceShip(
            typeOfBoat,
            newShipY,
            newShipX,
            newShipOrientation
          );
        if (replaceShipResult === false) {
          inputVacancyErrorDisplay(typeOfBoat);
        }
      }

      //replace old sea board with new sea board generated after placing ship
      placeShipsUI.replaceChild(
        buildSeaBoard(gameInstance.attackingPlayer),
        document.querySelector(".user-sea-placer")
      );
      //add class to newly rendered sea board
      document
        .querySelector(".place-ships-ui .defense-sea-board")
        .classList.add("user-sea-placer");
    }

    //functions to output error messages
    function inputRangeErrorDisplay(boat) {
      let boatInputError = document.createElement("span");
      boatInputError.classList.add("ship-input-error");
      boatInputError.textContent = `${boat}'s y or x input value would place it out of the range of the sea into the nether`;
      shipPlaceTable.after(boatInputError);
      setTimeout(() => {
        boatInputError.remove();
      }, 5000);
    }
    function inputOrientationErrorDisplay(boat) {
      let boatInputError = document.createElement("span");
      boatInputError.classList.add("ship-input-error");
      boatInputError.textContent = `${boat} does not have an orientation selected`;
      shipPlaceTable.after(boatInputError);
      setTimeout(() => {
        boatInputError.remove();
      }, 5000);
    }

    function inputVacancyErrorDisplay(boat) {
      let boatInputError = document.createElement("span");
      boatInputError.classList.add("ship-input-error");
      boatInputError.textContent = `${boat} new location is already occupied by another ship`;
      shipPlaceTable.after(boatInputError);
      setTimeout(() => {
        boatInputError.remove();
      }, 5000);
    }

    //listeners on add/replace buttons
    //carrier
    let carrierAddReplaceButtonDom = document.querySelector(
      "#add-replace-carrier"
    );
    carrierAddReplaceButtonDom.addEventListener("click", async () => {
      //if the inputs are within range, and an orientation is selected, and there is not a ship already in those sea spots, then place the ship there
      if (
        //y and x inputs are within range
        carrierAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value >= 1 &&
        carrierAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value <= 10 &&
        carrierAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value >= 1 &&
        carrierAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value <= 10 &&
        //an orientation has been selected
        carrierAddReplaceButtonDom.parentElement.parentElement.childNodes[4]
          .childNodes[0].value !== "Choose" &&
        //and prospective entire ship would fit in sea board range
        gameInstance.attackingPlayer.gameboard.withinSeaRange(
          carrierAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
            .childNodes[0].value - 1,
          carrierAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
            .childNodes[0].value - 1,
          carrierAddReplaceButtonDom.parentElement.parentElement.childNodes[4]
            .childNodes[0].value,
          5
        )
      ) {
        let confirm = await verifyModal(
          "place the Battleship",
          `at ${carrierAddReplaceButtonDom.parentElement.parentElement.childNodes[2].childNodes[0].value}, ${carrierAddReplaceButtonDom.parentElement.parentElement.childNodes[3].childNodes[0].value} pointing to the ${carrierAddReplaceButtonDom.parentElement.parentElement.childNodes[4].childNodes[0].value} direction`
        );
        //confirm with user before placing ship
        if (confirm) {
          addOrReplaceShip(carrierAddReplaceButtonDom);
        }
        //otherwise if the ship is being placed out of the seaboard's range then tell the user
      } else if (
        gameInstance.attackingPlayer.gameboard.withinSeaRange(
          carrierAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
            .childNodes[0].value - 1,
          carrierAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
            .childNodes[0].value - 1,
          carrierAddReplaceButtonDom.parentElement.parentElement.childNodes[4]
            .childNodes[0].value,
          5
        ) === false
      ) {
        inputRangeErrorDisplay("Carrier");
        //else if there was no orientation selected, tell the user
      } else if (
        carrierAddReplaceButtonDom.parentElement.parentElement.childNodes[4]
          .childNodes[0].value === "Choose"
      ) {
        inputOrientationErrorDisplay("Carrier");
      }
    });

    //battleship
    let battleshipAddReplaceButtonDom = document.querySelector(
      "#add-replace-battleship"
    );
    battleshipAddReplaceButtonDom.addEventListener("click", async () => {
      //if the inputs are within range, and an orientation is selected, and there is not a ship already in those sea spots, then place the ship there
      if (
        battleshipAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value >= 1 &&
        battleshipAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value <= 10 &&
        battleshipAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value >= 1 &&
        battleshipAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value <= 10 &&
        battleshipAddReplaceButtonDom.parentElement.parentElement.childNodes[4]
          .childNodes[0].value !== "Choose" &&
        gameInstance.attackingPlayer.gameboard.withinSeaRange(
          battleshipAddReplaceButtonDom.parentElement.parentElement
            .childNodes[2].childNodes[0].value - 1,
          battleshipAddReplaceButtonDom.parentElement.parentElement
            .childNodes[3].childNodes[0].value - 1,
          battleshipAddReplaceButtonDom.parentElement.parentElement
            .childNodes[4].childNodes[0].value,
          4
        )
      ) {
        let confirm = await verifyModal(
          "place the Battleship",
          `at ${battleshipAddReplaceButtonDom.parentElement.parentElement.childNodes[2].childNodes[0].value}, ${battleshipAddReplaceButtonDom.parentElement.parentElement.childNodes[3].childNodes[0].value} pointing to the ${battleshipAddReplaceButtonDom.parentElement.parentElement.childNodes[4].childNodes[0].value} direction`
        );
        //confirm with user before placing ship
        if (confirm) {
          addOrReplaceShip(battleshipAddReplaceButtonDom);
        }
        //otherwise if the ship is being placed out of the seaboard's range then tell the user
      } else if (
        battleshipAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value < 1 ||
        battleshipAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value > 10 ||
        battleshipAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value < 1 ||
        battleshipAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value > 10
      ) {
        inputRangeErrorDisplay("Battleship");
        //else if there was no orientation selected, tell the user
      } else if (
        battleshipAddReplaceButtonDom.parentElement.parentElement.childNodes[4]
          .childNodes[0].value === "Choose"
      ) {
        inputOrientationErrorDisplay("Battleship");
      }
    });

    //destroyer
    let destroyerAddReplaceButtonDom = document.querySelector(
      "#add-replace-destroyer"
    );
    destroyerAddReplaceButtonDom.addEventListener("click", async () => {
      //if the inputs are within range, and an orientation is selected, and there is not a ship already in those sea spots, then place the ship there
      if (
        destroyerAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value >= 1 &&
        destroyerAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value <= 10 &&
        destroyerAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value >= 1 &&
        destroyerAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value <= 10 &&
        destroyerAddReplaceButtonDom.parentElement.parentElement.childNodes[4]
          .childNodes[0].value !== "Choose" &&
        gameInstance.attackingPlayer.gameboard.withinSeaRange(
          destroyerAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
            .childNodes[0].value - 1,
          destroyerAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
            .childNodes[0].value - 1,
          destroyerAddReplaceButtonDom.parentElement.parentElement.childNodes[4]
            .childNodes[0].value,
          3
        )
      ) {
        let confirm = await verifyModal(
          "place the Battleship",
          `at ${destroyerAddReplaceButtonDom.parentElement.parentElement.childNodes[2].childNodes[0].value}, ${destroyerAddReplaceButtonDom.parentElement.parentElement.childNodes[3].childNodes[0].value} pointing to the ${destroyerAddReplaceButtonDom.parentElement.parentElement.childNodes[4].childNodes[0].value} direction`
        );
        //confirm with user before placing ship
        if (confirm) {
          addOrReplaceShip(destroyerAddReplaceButtonDom);
        }
        //otherwise if the ship is being placed out of the seaboard's range then tell the user
      } else if (
        destroyerAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value < 1 ||
        destroyerAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value > 10 ||
        destroyerAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value < 1 ||
        destroyerAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value > 10
      ) {
        inputRangeErrorDisplay("Destroyer");
        //else if there was no orientation selected, tell the user
      } else if (
        destroyerAddReplaceButtonDom.parentElement.parentElement.childNodes[4]
          .childNodes[0].value === "Choose"
      ) {
        inputOrientationErrorDisplay("Destroyer");
      }
    });

    //submarine
    let submarineAddReplaceButtonDom = document.querySelector(
      "#add-replace-submarine"
    );
    submarineAddReplaceButtonDom.addEventListener("click", async () => {
      //if the inputs are within range, and an orientation is selected, and there is not a ship already in those sea spots, then place the ship there
      if (
        submarineAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value >= 1 &&
        submarineAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value <= 10 &&
        submarineAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value >= 1 &&
        submarineAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value <= 10 &&
        submarineAddReplaceButtonDom.parentElement.parentElement.childNodes[4]
          .childNodes[0].value !== "Choose" &&
        gameInstance.attackingPlayer.gameboard.withinSeaRange(
          submarineAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
            .childNodes[0].value - 1,
          submarineAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
            .childNodes[0].value - 1,
          submarineAddReplaceButtonDom.parentElement.parentElement.childNodes[4]
            .childNodes[0].value,
          3
        )
      ) {
        let confirm = await verifyModal(
          "place the Battleship",
          `at ${submarineAddReplaceButtonDom.parentElement.parentElement.childNodes[2].childNodes[0].value}, ${submarineAddReplaceButtonDom.parentElement.parentElement.childNodes[3].childNodes[0].value} pointing to the ${submarineAddReplaceButtonDom.parentElement.parentElement.childNodes[4].childNodes[0].value} direction`
        );
        //confirm with user before placing ship
        if (confirm) {
          addOrReplaceShip(submarineAddReplaceButtonDom);
        }
        //otherwise if the ship is being placed out of the seaboard's range then tell the user
      } else if (
        submarineAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value < 1 ||
        submarineAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value > 10 ||
        submarineAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value < 1 ||
        submarineAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value > 10
      ) {
        inputRangeErrorDisplay("Submarine");
        //else if there was no orientation selected, tell the user
      } else if (
        submarineAddReplaceButtonDom.parentElement.parentElement.childNodes[4]
          .childNodes[0].value === "Choose"
      ) {
        inputOrientationErrorDisplay("Submarine");
      }
    });

    //patrol boat
    let patrolBoatAddReplaceButtonDom = document.querySelector(
      "#add-replace-patrolBoat"
    );
    patrolBoatAddReplaceButtonDom.addEventListener("click", async () => {
      //if the inputs are within range, and an orientation is selected, and there is not a ship already in those sea spots, then place the ship there
      if (
        patrolBoatAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value >= 1 &&
        patrolBoatAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value <= 10 &&
        patrolBoatAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value >= 1 &&
        patrolBoatAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value <= 10 &&
        patrolBoatAddReplaceButtonDom.parentElement.parentElement.childNodes[4]
          .childNodes[0].value !== "Choose" &&
        gameInstance.attackingPlayer.gameboard.withinSeaRange(
          patrolBoatAddReplaceButtonDom.parentElement.parentElement
            .childNodes[2].childNodes[0].value - 1,
          patrolBoatAddReplaceButtonDom.parentElement.parentElement
            .childNodes[3].childNodes[0].value - 1,
          patrolBoatAddReplaceButtonDom.parentElement.parentElement
            .childNodes[4].childNodes[0].value,
          2
        )
      ) {
        let confirm = await verifyModal(
          "place the Battleship",
          `at ${patrolBoatAddReplaceButtonDom.parentElement.parentElement.childNodes[2].childNodes[0].value}, ${patrolBoatAddReplaceButtonDom.parentElement.parentElement.childNodes[3].childNodes[0].value} pointing to the ${patrolBoatAddReplaceButtonDom.parentElement.parentElement.childNodes[4].childNodes[0].value} direction`
        );
        //confirm with user before placing ship
        if (confirm) {
          addOrReplaceShip(patrolBoatAddReplaceButtonDom);
        }
        //otherwise if the ship is being placed out of the seaboard's range then tell the user
      } else if (
        patrolBoatAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value < 1 ||
        patrolBoatAddReplaceButtonDom.parentElement.parentElement.childNodes[2]
          .childNodes[0].value > 10 ||
        patrolBoatAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value < 1 ||
        patrolBoatAddReplaceButtonDom.parentElement.parentElement.childNodes[3]
          .childNodes[0].value > 10
      ) {
        inputRangeErrorDisplay("Patrol Boat");
        //else if there was no orientation selected, tell the user
      } else if (
        patrolBoatAddReplaceButtonDom.parentElement.parentElement.childNodes[4]
          .childNodes[0].value === "Choose"
      ) {
        inputOrientationErrorDisplay("Patrol Boat");
      }
    });
  });
}

//modal for verifying actions
function verifyModal(action, subject) {
  if (isModalActive === false) {
    isModalActive = true;
    return new Promise((resolve) => {
      let modalUi = document.createElement("div");
      modalUi.classList.add("verifyModal");

      let modalHeader = document.createElement("h2");
      modalHeader.textContent = "Verify Action";
      modalUi.appendChild(modalHeader);

      let modalDescription = document.createElement("p");
      modalDescription.textContent = `Are you sure you want to ${action} ${subject}?`;
      modalUi.appendChild(modalDescription);

      let actionButtons = document.createElement("section");
      let verifyButton = document.createElement("button");
      let cancelButton = document.createElement("button");
      verifyButton.type = "button";
      cancelButton.type = "button";
      verifyButton.id = "verifyConfirm";
      cancelButton.id = "cancelConfirm";
      verifyButton.textContent = `${action.slice()}`;
      cancelButton.textContent = "Cancel";
      actionButtons.appendChild(verifyButton);
      actionButtons.appendChild(cancelButton);
      actionButtons.classList.add("action-section");
      modalUi.appendChild(actionButtons);

      document.querySelector("body").appendChild(modalUi);
      let verifyAction = document.querySelector("#verifyConfirm");
      let cancelAction = document.querySelector("#cancelConfirm");

      verifyAction.addEventListener("click", () => {
        modalUi.remove();
        resolve(true);
        isModalActive = false;
      });

      cancelAction.addEventListener("click", () => {
        modalUi.remove();
        resolve(false);
        isModalActive = false;
      });
    });
  }
}

function randomlyPlaceShips(player) {
  let orientations = ["up", "down", "left", "right"];
  //place a carrier while there isn't one
  while (
    player.gameboard.boats.filter(
      // eslint-disable-next-line prettier/prettier
      (boat) => boat.type === "carrier"
    ).length < 1
  ) {
    player.gameboard.placeShip(
      //random y placement
      Math.floor(Math.random() * 10),
      //random x placement
      Math.floor(Math.random() * 10),
      //orientation
      orientations[Math.floor(Math.random() * 4)],
      //length
      5,
      //type
      "carrier"
    );
  }
  //place a battleship while there isn't one
  while (
    player.gameboard.boats.filter(
      // eslint-disable-next-line prettier/prettier
      (boat) => boat.type === "battleship"
    ).length < 1
  ) {
    player.gameboard.placeShip(
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      orientations[Math.floor(Math.random() * 4)],
      4,
      "battleship"
    );
  }

  //place a destroyer while there isn't one
  while (
    player.gameboard.boats.filter(
      // eslint-disable-next-line prettier/prettier
      (boat) => boat.type === "destroyer"
    ).length < 1
  ) {
    player.gameboard.placeShip(
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      orientations[Math.floor(Math.random() * 4)],
      3,
      "destroyer"
    );
  }
  //place submarine while there isn't one
  while (
    player.gameboard.boats.filter(
      // eslint-disable-next-line prettier/prettier
      (boat) => boat.type === "submarine"
    ).length < 1
  ) {
    player.gameboard.placeShip(
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      orientations[Math.floor(Math.random() * 4)],
      3,
      "submarine"
    );
  }
  //place a patrol boat while there isn't one
  while (
    player.gameboard.boats.filter(
      // eslint-disable-next-line prettier/prettier
      (boat) => boat.type === "patrol boat"
    ).length < 1
  ) {
    player.gameboard.placeShip(
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      orientations[Math.floor(Math.random() * 4)],
      2,
      "patrol boat"
    );
  }
}
