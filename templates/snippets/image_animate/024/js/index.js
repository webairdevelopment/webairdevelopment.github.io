
var tl = new TimelineMax({repeat: 5, repeatDelay: 2});

tl.add(TweenMax.to(".drip", 3, {
    top: 350,
  })
);
tl.add(TweenMax.to(".drip", .5, {
    top: 420,
  }, "+1.1")
);
tl.add(TweenMax.to(".drip", 0.01, {
    height: 0,
    width: 0,
  }, "+1.6")
);




document.querySelector(".container").addEventListener("mouseenter", function(e) {
  var tlHover = new TimelineMax();
  tlHover.add(TweenMax.to(this, 0.1, {
    rotation: 5,
  })
  );
  tlHover.add(TweenMax.to(this, 0.2, {
    rotation: -5,
  }, 0.1)
  );
  tlHover.add(TweenMax.to(this, 0.1, {
    rotation: 0,
  }, 0.3)
  );
})
document.querySelector(".container").addEventListener("click", function(e) {
  var tlClick = new TimelineMax();
  tlClick.add(TweenMax.to(".eye", 0.2, {
    rotation: 360,
  })
  );
  tlClick.add(TweenMax.to(".eye", 0, {
    rotation: 0,
  }, 0.2)
  );
})