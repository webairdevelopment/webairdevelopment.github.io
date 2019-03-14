
var cards = document.querySelectorAll(".card");
var svgPaths = document.querySelectorAll("path");
var svgTexts = document.querySelectorAll("text");
var nextBtn = document.querySelector("#next-btn");
var shuffleBtn = document.querySelector("#shuffle-btn");
var scoreFields = document.querySelectorAll(".score-field");
var activePlayer = 1;
var iconCount = 8;
var foundPairs = 0;
var gameOver = false;
var selectedIcons = [0, 0, 0, 0, 0, 0, 0, 0];
var turnedCardCount = 0;
var turnedCard1;
var turnedCard2;

shuffleBtn.addEventListener("click", function() {
  resetField();
  initiateGame();
});

nextBtn.addEventListener("click", nextPlayer);

initiateGame();

function initiateGame() {
  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", turnCard);
    var iconID = getID();
    cards[i]
      .querySelector(".card__icon-reference")
      .setAttribute("xlink:href", "#icon-" + iconID);
  }
}

function getID() {
  var id = getRandomInt(1, iconCount);
  if (selectedIcons[id - 1] < 2) {
    selectedIcons[id - 1]++;
    return id;
  }
  return getID();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function turnCard() {
  turnedCardCount++;
  if (turnedCardCount < 3) {
    this.classList.add("card--active");
    if (turnedCardCount == 1) {
      turnedCard1 = this;
    } else {
      turnedCard2 = this;
      if (
        turnedCard1
          .querySelector(".card__icon-reference")
          .getAttribute("xlink:href") ==
        turnedCard2
          .querySelector(".card__icon-reference")
          .getAttribute("xlink:href")
      ) {
        turnedCard1.classList.add("card--found");
        turnedCard1.removeEventListener("click", turnCard);
        turnedCard2.classList.add("card--found");
        turnedCard2.removeEventListener("click", turnCard);
        turnedCardCount = 0;
        updateScore();
        checkGameOver();
      } else {
        nextBtn.classList.add("btn--pulse");
      }
    }
  }
}

function updateScore() {
  scoreFields[activePlayer-1].innerHTML = parseInt(scoreFields[activePlayer-1].innerHTML) + 1;
}

function checkGameOver() {
  foundPairs++;
  if(foundPairs >= iconCount){
    shuffleBtn.classList.add("btn--pulse");
    gameOver = true;
  }
}

function nextPlayer() {
  if(gameOver) {
    return;
  }
  
  turnedCard1.classList.remove("card--active");
  turnedCard2.classList.remove("card--active");
  nextBtn.classList.remove("btn--pulse");
  turnedCardCount = 0;
  changePlayer();
}

function changePlayer() {
  activePlayer = activePlayer == 1 ? 2 : 1;
  
  for(var i = 0; i < cards.length; i++) {
    cards[i].classList.toggle("card--player2");
  }
  console.log(svgPaths);
  
  for(var z = 0; z < svgPaths.length; z++) {
    svgPaths[z].classList.toggle("card-fill--player2");
    console.log("check2");
  }
  
  for(var x = 0; x < svgTexts.length; x++) {
    svgTexts[x].classList.toggle("card-fill--player2");
  }
}

function resetField() {
  foundPairs = 0;
  gameOver = false;
  iconCount = 8;
  turnedCardCount = 0;
  
  shuffleBtn.classList.remove("btn--pulse");
  
  if(activePlayer == 2) {
    changePlayer();
  }

  for (var i = 0; i < selectedIcons.length; i++) {
    selectedIcons[i] = 0;
  }

  for (var z = 0; z < cards.length; z++) {
    cards[z].classList.remove("card--active");
    cards[z].classList.remove("card--found");
  }
}