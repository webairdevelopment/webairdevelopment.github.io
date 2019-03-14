(function($) {
  
  var header = $('#header-bg');
  var menuButton = $('#menu-icon');
  var menuButtonX = $('#menu-icon-x');
  var menuIcon = $('.header-el');
  var menuIconPhoto = $('#header-photo');
  var menuIconPeople = $('#header-people');
  var menuIconMex = $('#header-mex');
  var menuIconHeart = $('#header-heart');
  
  var homeElement = $('.el-home-anima');
  var tlhome = new TimelineMax();
  
  //start
  menuButton.addClass('menu-icon-in');
  menuButtonX.addClass('menu-icon-out');
  header.addClass('header-bg');
  tlhome
      .staggerFrom(homeElement, 0.6, { y: 20, autoAlpha: 0, ease:Bounce.easeOut}, 0.2)
      ;
  
  //button menu
  menuButton.on('click', function(){
      menuButton.removeClass('menu-icon-in');
      menuButton.addClass('menu-icon-out');
      menuButtonX.addClass('menu-icon-in');
      menuButtonX.removeClass('menu-icon-out');
    
      menuIconPhoto.addClass('header-el-anima');
      menuIconPeople.addClass('header-el-anima');
      menuIconMex.addClass('header-el-anima');
      menuIconHeart.addClass('header-el-anima');
    });
  
  menuButtonX.on('click', function(){
      header.addClass('header-bg');
      header.removeClass('header-bg-photo');
      header.removeClass('header-bg-people');
      header.removeClass('header-bg-mex');
      header.removeClass('header-bg-heart');
      
      menuButton.addClass('menu-icon-in');
      menuButton.removeClass('menu-icon-out');
      menuButtonX.addClass('menu-icon-out');
      menuButtonX.removeClass('menu-icon-in');
      
      menuIconPhoto.removeClass('header-el-anima');
      menuIconPeople.removeClass('header-el-anima');
      menuIconMex.removeClass('header-el-anima');
      menuIconHeart.removeClass('header-el-anima');      
      tlhome.restart();
    });
  
  //button Photo
  menuIconPhoto.on('click', function(){
    
      menuButton.removeClass('menu-icon-in');
      menuButton.addClass('menu-icon-out');
      menuButtonX.addClass('menu-icon-in');
      menuButtonX.removeClass('menu-icon-out');
    
      menuIconPhoto.toggleClass('header-el-anima');
      menuIconPeople.toggleClass('header-el-anima');
      menuIconMex.toggleClass('header-el-anima');
      menuIconHeart.toggleClass('header-el-anima');
      header.addClass('header-bg-photo');
        header.removeClass('header-bg-people');
        header.removeClass('header-bg-mex');
        header.removeClass('header-bg-heart');
      tlhome.restart();
    });
  menuIconPeople.on('click', function(){
    
      menuButton.removeClass('menu-icon-in');
      menuButton.addClass('menu-icon-out');
      menuButtonX.addClass('menu-icon-in');
      menuButtonX.removeClass('menu-icon-out');
    
      menuIconPhoto.toggleClass('header-el-anima');
      menuIconPeople.toggleClass('header-el-anima');
      menuIconMex.toggleClass('header-el-anima');
      menuIconHeart.toggleClass('header-el-anima');
      header.addClass('header-bg-people');
        header.removeClass('header-bg-photo');
        header.removeClass('header-bg-mex');
        header.removeClass('header-bg-heart');
      tlhome.restart();
    });
  menuIconMex.on('click', function(){
      
      menuButton.removeClass('menu-icon-in');
      menuButton.addClass('menu-icon-out');
      menuButtonX.addClass('menu-icon-in');
      menuButtonX.removeClass('menu-icon-out');
    
      menuIconPhoto.toggleClass('header-el-anima');
      menuIconPeople.toggleClass('header-el-anima');
      menuIconMex.toggleClass('header-el-anima');
      menuIconHeart.toggleClass('header-el-anima');
    
      header.addClass('header-bg-mex');
        header.removeClass('header-bg-photo');
        header.removeClass('header-bg-people');
        header.removeClass('header-bg-heart');
      tlhome.restart();
    });
  menuIconHeart.on('click', function(){      
      menuButton.removeClass('menu-icon-in');
      menuButton.addClass('menu-icon-out');
      menuButtonX.addClass('menu-icon-in');
      menuButtonX.removeClass('menu-icon-out');
      
      menuIconPhoto.toggleClass('header-el-anima');
      menuIconPeople.toggleClass('header-el-anima');
      menuIconMex.toggleClass('header-el-anima');
      menuIconHeart.toggleClass('header-el-anima');
      header.addClass('header-bg-heart');
        header.removeClass('header-bg-photo');
        header.removeClass('header-bg-people');
        header.removeClass('header-bg-mex');
      tlhome.restart();
    });
  

  
  
  
  
  
  
  
  
 })(jQuery);