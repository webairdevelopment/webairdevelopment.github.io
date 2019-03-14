
const button  = document.getElementById('trigger');
const heading = document.getElementById('heading');

Splitting();

button.addEventListener('click', () => {
  heading.classList.remove('show-text');
  setTimeout(() => heading.classList.add('show-text'), 100);
})