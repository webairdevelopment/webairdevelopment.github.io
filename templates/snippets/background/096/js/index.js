let card = document.querySelector('.billboard');
let boards = Array.from(card.querySelectorAll('li'));

// Set CSS Variable to represent how many list items we have
card.style.setProperty('--boards', boards.length);

// Give each list item an offset for the background-position so the images appear complete across all the list items
boards.forEach((board, i) => {
  board.style.setProperty('--offset-x', -i / (boards.length));
});