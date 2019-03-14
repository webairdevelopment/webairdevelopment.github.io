//variables
const card = document.querySelector("#card");
const front = document.querySelector(".front");
const back = document.querySelector(".back");
const next = document.querySelector("#next");
const prev = document.querySelector("#prev");
const count = document.querySelector("#count");
const endpoint =
  "https://gist.githubusercontent.com/cahdeemer/90a32410656e2aa33d29b694bc28ab08/raw/4c7ae385f4f1c1ec7c42ef0154f927ace3d3f12e/interview_prep.json";
const questions = [];

let current = 0;
let turned = false;

//remember that fetch doesn't return the data, fetch returns a promise
fetch(endpoint)
  //blog.json also returns a promise
  .then(blob => blob.json())
  //using spread operator means that we don't get an nested arrays, we just get an array
  .then(data => questions.push(...data))
  //we set the initial state after data is ready
  .then(populateNextCard);

function resetCard() {
  prev.disabled = false;
  next.disabled = false;
  card.classList.remove("turned");
}

function populateNextCard() {
  resetCard();
  front.innerHTML = `<p>${questions[current].question}</p>`;
  back.innerHTML = `<p>${questions[current].answer}</p>`;
  count.innerHTML = `<p>${[current + 1]} / ${questions.length}</p>`;
  current++;
}

function getNextCard() {
  if (current < questions.length) {
    populateNextCard();
  } else {
    next.disabled = true;
  }
}

function getPrevCard() {
  if (current > 1) {
    resetCard();
    front.innerHTML = `<p>${questions[current - 2].question}</p>`;
    back.innerHTML = `<p>${questions[current - 2].answer}</p>`;
    count.innerHTML = `<p>${[current - 1]} / ${questions.length}</p>`;
    current--;
  } else {
    prev.disabled = true;
  }
}

function toggleTurn(e) {
  turned = !turned;
  if (turned) {
    this.classList.add("turned");
  } else {
    this.classList.remove("turned");
  }
}


card.addEventListener("click", toggleTurn);
next.addEventListener("click", getNextCard);
prev.addEventListener("click", getPrevCard);