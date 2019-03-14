const form = document.getElementById('form');
const formInputs = form.querySelectorAll('input');
const formMessage = document.getElementById('formMessage');
const formMessageTitle = document.getElementById('formMessageTitle');
const formMessageText = document.getElementById('formMessageText');
const alertButton = document.getElementById('alertButton');

const displayFormMessage = function(style, title, text) {
  formMessage.className = '';
  formMessage.className = `form-message form-message--${ style }`;
  formMessage.style.display = 'block';
  formMessageTitle.textContent = title;
  formMessageText.textContent = text;
}

// Hide formMessage whenever an input changes
for (const formInput of formInputs) {
  formInput.addEventListener('change', () => {
    formMessage.style.display = 'none';
  });
}

// Display message on form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);
  const formInputsChecked = formData.has('radio-group') || formData.has('checkbox-group');
  
  if (formInputsChecked) {
    // Display a success message if there's fields checked
    displayFormMessage('success', 'Congratulations!', 'You managed to fill out the form!');
  } else {
    // Display an error message if there's no fields checked
  displayFormMessage('Heading', 'Heading Two', 'Massage Two');
  }
});

// Display error message on reset
form.addEventListener('reset', () => {
  displayFormMessage('Heading', 'Heading Three', 'Massage Three');
});

// Display alert message on alert button click
alertButton.addEventListener('click', () => {
  displayFormMessage('Heading', 'Heading One', 'Massage one');
});