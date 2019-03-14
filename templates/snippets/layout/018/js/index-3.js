
// includes throttle
// includes responsiveChange

console.clear();

var carousels = document.querySelectorAll('.js-carousel');

var classes = {
  next: 'c-carousel__control--next',
  prev: 'c-carousel__control--prev' };

var carousel_breakpoints = [
{
  min_width: 0,
  max_display: 2 },

{
  min_width: 576,
  max_display: 3 },

{
  min_width: 768,
  max_display: 4 },

{
  min_width: 992,
  max_display: 5 },

{
  min_width: 1200,
  max_display: 6 }];



// let max_display = carousel_breakpoints[0].max_display



function config(carousel, el) {
  carousel.el = el;
  carousel.btn_prev = el.querySelector('.js-carousel__prev');
  carousel.btn_next = el.querySelector('.js-carousel__next');
  carousel.items = el.querySelectorAll('.js-carousel__item');
  carousel.item_cnt = carousel.items.length;
  carousel.el.dataset.carousel_size = el.classList.contains('c-carousel--small') ? 'sm' : 'lg';

  carousel.el.dataset.item_cnt = carousel.item_cnt;
  carousel.el.dataset.carousel_offset = 0;
}



function updateMaxDisplay() {

  carousels.forEach(function (el) {
    var current_offset = Number(el.dataset.carousel_offset);
    var items = el.querySelectorAll('.js-carousel__item');
    var carousel_width = el.offsetWidth;

    carousel_breakpoints.every(function (breakpoint) {
      if (carousel_width >= breakpoint.min_width) {
        el.dataset.max_display = breakpoint.max_display;
        return true;
      }
    });

    var max_offset = items.length - el.dataset.max_display;

    if (current_offset >= max_offset) {
      el.dataset.carousel_offset = max_offset;

      items.forEach(function (item) {
        item.style.transform = 'translateX(-' + 100 * max_offset + '%)';
      });
    }

    updateControlDisplay(el, current_offset, max_offset);
  });
}


function shift(carousel, direction) {
  var offset_cur = Number(carousel.el.dataset.carousel_offset);
  var offset_max = carousel.item_cnt - carousel.el.dataset.max_display;
  var offset_new = void 0;

  if (direction === 'prev') {
    offset_new = offset_cur === 0 ? 0 : offset_cur - 1;
  } else {
    offset_new = offset_cur === carousel.item_cnt ? carousel.item_cnt : offset_cur + 1;
  }

  if (offset_new > offset_max) {
    offset_new = offset_max;
  }

  carousel.el.dataset.carousel_offset = offset_new;

  carousel.items.forEach(function (item) {
    item.style.transform = 'translateX(-' + 100 * offset_new + '%)';
  });

  updateControlDisplay(carousel.el, offset_new, offset_max);
}


function updateControlDisplay(carousel_el, offset_cur, offset_max) {
  if (offset_cur >= offset_max) {
    carousel_el.classList.add('c-carousel--disable-next');
  } else {
    carousel_el.classList.remove('c-carousel--disable-next');
  }

  if (offset_cur <= 0) {
    carousel_el.classList.add('c-carousel--disable-prev');
  } else {
    carousel_el.classList.remove('c-carousel--disable-prev');
  }
}

function updateControls(carousel) {
  var offset_max = carousel.item_cnt - carousel.el.dataset.max_display;
  var offset_cur = Number(carousel.el.dataset.carousel_offset);

  if (offset_cur >= offset_max) {
    carousel.el.classList.add('c-carousel--disable-next');
  } else {
    carousel.el.classList.remove('c-carousel--disable-next');
  }

  if (offset_cur === 0) {
    carousel.el.classList.add('c-carousel--disable-prev');
  }
}


carousels.forEach(function (el) {
  var carousel = {};

  config(carousel, el);

  carousel.btn_prev.addEventListener('click', function () {
    shift(carousel, 'prev');
  });
  carousel.btn_next.addEventListener('click', function () {
    shift(carousel, 'next');
  });
});

updateMaxDisplay();

responsiveChange(updateMaxDisplay);