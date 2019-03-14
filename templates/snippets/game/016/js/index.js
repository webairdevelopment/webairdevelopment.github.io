
var board = document.querySelector('.board');
var clone = document.querySelector('.clone');
var overlay = document.querySelector('.overlay');
var reset = document.querySelector('.reset');
var tileOptions = ['erupt', 'ptero', 'tri', 'ahahah', 'egg', 'dino'];

// 🏇 Race you to the race conditions! >:D
var state = {
  selections: [],
  boardLocked: false,
  matches: 0 };


reset.addEventListener('click', function () {
  if (state.boardLocked) return;
  resetGame();
});

function resetGame() {
  state.boardLocked = true;
  state.selections = [];
  state.matches = 0;

  document.querySelectorAll('.cube').forEach(function (tile) {
    tile.removeEventListener('click', function () {return selectTile(tile);});
    tile.remove();
  });

  overlay.classList.add('hidden');
  createBoard();
}

function createBoard() {
  var tiles = shuffleArray([].concat(tileOptions, tileOptions));
  var length = tiles.length;var _loop = function _loop(

  i) {
    window.setTimeout(function () {
      board.appendChild(buildTile(tiles.pop(), i));
    }, i * 100);};for (var i = 0; i < length; i++) {_loop(i);
  }

  window.setTimeout(function () {
    document.querySelectorAll('.cube').forEach(function (tile) {
      tile.addEventListener('click', function () {return selectTile(tile);});
    });

    state.boardLocked = false;
  }, tiles.length * 100);
}

function buildTile(option, id) {
  var tile = clone.cloneNode(true);
  tile.classList.remove('clone');
  tile.classList.add('cube');
  tile.setAttribute('data-tile', option);
  tile.setAttribute('data-id', id);
  return tile;
}

function selectTile(selectedTile) {
  if (state.boardLocked || selectedTile.classList.contains('flipped')) return;

  state.boardLocked = true;

  if (state.selections.length <= 1) {
    selectedTile.classList.add('flipped');
    state.selections.push({
      id: selectedTile.dataset.id,
      tile: selectedTile.dataset.tile,
      el: selectedTile });

  }

  /* =================================*
     *      Welcome to Timeout City     *
     *  Time since last incident: 300ms *
     * =================================*/
  if (state.selections.length === 2) {
    if (state.selections[0].tile === state.selections[1].tile) {
      window.setTimeout(function () {
        state.selections[0].el.classList.add('matched');
        state.selections[1].el.classList.add('matched');

        state.boardLocked = false;
        state.matches = state.matches + 1;

        if (state.matches === tileOptions.length) {
          window.setTimeout(function () {
            overlay.classList.remove('hidden');
            document.querySelector('.audio-win').play();
          }, 600);
        }
        state.selections = [];
        document.querySelector('.audio-' + selectedTile.dataset.tile).play();
      }, 600);
    } else {
      setTimeout(function () {
        document.querySelectorAll('.cube').forEach(function (tile) {
          tile.classList.remove('flipped');
        });
        state.boardLocked = false;
      }, 800);
      state.selections = [];
    }
  } else {
    state.boardLocked = false;
  }
}

// 🍝 Copy-Pasta - "ain't nobody got time for that"
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));var _ref =
    [array[j], array[i]];array[i] = _ref[0];array[j] = _ref[1];
  }
  return array;
}

createBoard();