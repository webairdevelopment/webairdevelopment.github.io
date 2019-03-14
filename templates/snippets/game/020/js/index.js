
var cards = document.querySelectorAll('.container > div');
var cardsOldInfo = {};
var cardsNewInfo = cardsOldInfo;

cards.forEach((card) => {
  card.addEventListener('click', () => {removeCard(card);});
});

function removeCard(card){
  cardsOldInfo = getCardsInfo();
  card.parentNode.removeChild(card);
  cardsNewInfo = getCardsInfo();
  moveCards();
}

function getCardsInfo(){
  updateCards();
  let cardsInfo = {};
  cards.forEach((card) => {
    var rect = card.getBoundingClientRect();
    cardsInfo[card.id] = {
      "x": rect.left,
      "y": rect.top,
      "width": (rect.right - rect.left)
    };
  });
  return cardsInfo;
}

function moveCards(){
  updateCards();
    cards.forEach((card) => {
      card.animate([ 
        {
          transform: `translate(${cardsOldInfo[card.id].x - cardsNewInfo[card.id].x}px, ${cardsOldInfo[card.id].y -cardsNewInfo[card.id].y}px) scaleX(${cardsOldInfo[card.id].width/cardsNewInfo[card.id].width})`
        }, 
        {
          transform: 'none'
        }
      ], { 
        duration: 250,
        easing: 'ease-out'
      });
  });
}

function updateCards(){
  cards = document.querySelectorAll('.container > div');
}