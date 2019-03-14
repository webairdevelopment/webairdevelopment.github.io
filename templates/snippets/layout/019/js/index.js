//initialize AOS transitions
AOS.init({
  duration: 1200,
})

//toggle dark mode theme
const darkModeToggleBtn = document.querySelector('#toggleDarkMode');
darkModeToggleBtn.addEventListener('click', (event) => { 
  
  document.body.classList.toggle('theme-dark');
});