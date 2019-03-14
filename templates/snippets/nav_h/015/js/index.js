var menu = document.querySelectorAll('.menu');
var icon = document.querySelectorAll('.icon-link');

menu.forEach(function (m) {
	m.addEventListener('click', function (e) {
		if (m.classList.contains('active')) {
			m.classList.add('clicked');
			m.classList.remove('active');
		} else
		{
			m.classList.remove('clicked');
			m.classList.add('active');
		}
	});
});

icon.forEach(function (i) {
	i.addEventListener('click', function (e) {
		e.stopPropagation();

		alert('clicked: ' + i.getAttribute('href'));
	});
});