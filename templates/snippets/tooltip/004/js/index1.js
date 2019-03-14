if (location.pathname.match(/fullcpgrid/i)) {
  document.documentElement.classList.add('grid-view');
  setTimeout(() => {
   document.querySelector('.block.y').classList.add('fake-hover');  
  }, 1750);
  setTimeout(() => {
   document.querySelector('.block.y').dispatchEvent(new Event('click'));  
  }, 2250);
}

