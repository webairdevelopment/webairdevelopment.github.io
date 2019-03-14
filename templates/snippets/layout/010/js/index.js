window.onload = function(){
  var layout1 = document.getElementById('layout1'),
      layout2 = document.getElementById('layout2');

  function hideLeft(layout){
    for(i=0; i < layout.children.length; i++){
      if(layout.children[i].classList.contains('show-left')){
        layout.children[i].classList.remove('show-left');
      } else if (layout.children[i].classList.contains('show-right')){
        layout.children[i].classList.remove('show-right');
      };
      layout.children[i].classList.add('hide-left');        
    }
  }
  function hideRight(layout){
    for(i=0; i < layout.children.length; i++){
      if(layout.children[i].classList.contains('show-left')){
        layout.children[i].classList.remove('show-left');
      } else if (layout.children[i].classList.contains('show-right')){
        layout.children[i].classList.remove('show-right');
      };
      layout.children[i].classList.add('hide-right'); 
    }
  }
  function showLeft(layout){
    for(i=0; i < layout.children.length; i++){
      if(layout.children[i].classList.contains('hide-left')){
        console.log("It had a hide left on it");
        layout.children[i].classList.remove('hide-left');
        console.log("but I removed it!");
      } else if (layout.children[i].classList.contains('hide-right')){
        layout.children[i].classList.remove('hide-right');
      };
      // Add show right
      layout.children[i].classList.add('show-left'); 
    }
  }
  function showRight(layout){
    for(i=0; i < layout.children.length; i++){
      if(layout.children[i].classList.contains('hide-left')){
        layout.children[i].classList.remove('hide-left');
      } else if (layout.children[i].classList.contains('hide-right')){
        layout.children[i].classList.remove('hide-right');
      };
      //Add show right
      layout.children[i].classList.add('show-right'); 
    }
  }
  
  // Initialize Layout 2 as hidden
  hideLeft(layout2);

  document.addEventListener('click', function(event){
    // If the clicked element doesn't have the right selector then bail
    if (!event.target.matches('.grid__item--nav span')) return; 
    // Don't follow any links
    event.preventDefault();
    // Perform desired action once clicked 
      if(event.target.matches('.grid--layout1 .grid__item--prev span')){
         //Add hide LEFT to current grid items and show RIGHT other grid items
        console.log("Layout 1 Prev was clicked!");      
        hideLeft(layout1); 
        layout2.classList.remove('hide');
        setTimeout(function(){
          layout1.classList.add('hide');
        }, 750);
        showLeft(layout2);
        return;
      } else if(event.target.matches('.grid--layout1 .grid__item--next span')){
         //Add hide LEFT to current grid items and show RIGHT other grid items
        console.log("Layout 1 Next was pressed!");
        hideRight(layout1);
        setTimeout(function(){
          layout1.classList.add('hide');
          layout2.classList.remove('hide');
        }, 750);
        showRight(layout2);
        return;
      } else if(event.target.matches('.grid--layout2 .grid__item--prev span')){
         //Add hide LEFT to current grid items and show RIGHT other grid items
        console.log("Layout 2 Prev was clicked!");
        hideLeft(layout2);
        setTimeout(function(){
          layout1.classList.remove('hide');
          layout2.classList.add('hide');          
        }, 750);
        showLeft(layout1);
        return;
      } else if(event.target.matches('.grid--layout2 .grid__item--next span')){
         //Add hide LEFT to current grid items and show RIGHT other grid items
        console.log("Layout 2 Next was clicked!");
        hideRight(layout2);
        setTimeout(function(){
          layout2.classList.add('hide');
          layout1.classList.remove('hide');
        }, 750);
        showRight(layout1);
        return;
      }   
    }, false
  );
}