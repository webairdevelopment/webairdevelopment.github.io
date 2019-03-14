/*--------------------
              Wheel Option
              -------------------*/
var option = {
  x: 0,
  speed: 1.5,
  limit: 2,
  time: 0.3 };



/*--------------------
               Init Scrollbar
               -------------------*/
var scrollbar = Scrollbar.init(document.querySelector('#scrollbar'), {
  overscrollEffect: 'bounce',
  alwaysShowTracks: true });

var listener = function listener(status) {
  console.log('scrollbar', status.offset.x);
  active = parseInt(status.offset.x / 500);

  bullets.forEach(function (b) {b.classList.remove('active');});
  bullets[active].classList.add('active');
};
scrollbar.addListener(listener);


/*--------------------
                                 Pagination
                                 -------------------*/
var active = 0;
var pag = void 0,bullets = void 0;

var pagination = function pagination() {
  var items = document.querySelectorAll('.item');
  pag = document.createElement('div');
  pag.classList.add('pagination');
  items.forEach(function (item, i) {
    var bullet = document.createElement('button');
    bullet.classList.add('bullet');
    bullet.innerHTML = i;
    pag.appendChild(bullet);
  });
  document.getElementById('scrollbar').appendChild(pag);
  bullets = document.querySelectorAll('.bullet');

  bullets.forEach(function (b, i) {
    b.addEventListener('click', function (el) {
      bullets.forEach(function (el) {el.classList.remove('active');});
      el.target.classList.add('active');
      var i = parseInt(el.target.innerHTML);
      active = i;

      var x = 500 * i;
      if (x > scrollbar.limit.x) {
        x = scrollbar.limit.x;
      }

      TweenMax.to(option, 1, {
        x: x,
        ease: Power4.easeOut,
        onUpdate: function onUpdate() {
          window.console.log('option', option.x);
          scrollbar.scrollTo(option.x, 0, 0);
        } });

    });
  });
};
pagination();


/*--------------------
              Mousewheel
              -------------------*/
var horizontalScroll = function horizontalScroll(e) {
  var y = parseInt(e.deltaY * option.speed);
  var x = scrollbar.offset.x + y;
  x = x < 0 ? 0 : x > scrollbar.limit.x ? scrollbar.limit.x : x;

  TweenMax.to(option, option.time, {
    x: x,
    onUpdate: function onUpdate() {
      window.console.log('option', option.x);
      scrollbar.scrollTo(option.x, 0, 0);
    } });

};
document.querySelector('.wrapper').addEventListener('mousewheel', function (e) {
  horizontalScroll(e);
});