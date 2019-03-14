;(function() {
  const $logo = document.querySelector('.logo');

  let geometricData = {};
  let currentDirection;
  let currentPosition;

  function setGeometricData() {
    geometricData.logoWidth = $logo.clientWidth;
    geometricData.logoHeight = $logo.clientHeight;
    geometricData.screenEdgeRight = innerWidth;
    geometricData.screenEdgeBottom = innerHeight;
  }

  function initializeValues() {
    setGeometricData();
    currentDirection = { x: 1, y: 1 };
    currentPosition = { x: 0, y: 0 };
  }

  let resizeDebounce;
  function reset() {
    if (resizeDebounce) {
      clearTimeout(resizeDebounce);
    } else {
      document.body.classList.add('is-resizing');
    }

    resizeDebounce = setTimeout(() => {
      initializeValues();

      document.body.classList.remove('is-resizing');

      resizeDebounce = null;
    }, 500);
  }

  function move() {
    const newX = currentPosition.x + currentDirection.x;
    const newY = currentPosition.y + currentDirection.y;

    if (newX + geometricData.logoWidth === geometricData.screenEdgeRight) {
      currentDirection.x = -1;
    } else if (newX === 0) {
      currentDirection.x = 1;
    }

    if (newY + geometricData.logoHeight === geometricData.screenEdgeBottom) {
      currentDirection.y = -1;
    } else if (newY === 0) {
      currentDirection.y = 1;
    }

    currentPosition.x = newX;
    currentPosition.y = newY;

    $logo.style.transform = 'translate3d(' + newX + 'px, ' + newY + 'px, 0)';

    requestAnimationFrame(move);
  }

  initializeValues();
  requestAnimationFrame(move);
  addEventListener('resize', reset);
})();