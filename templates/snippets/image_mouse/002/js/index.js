var rippleBtns = document.querySelectorAll('.ripple');

rippleBtns.forEach(function (rippleBtn) {
	rippleBtn.addEventListener('click', function (e) {
		if (!rippleBtn.classList.contains('rippling')) {
			rippleBtn.classList.add('rippling');
			rippleBtn.addEventListener('animationend', function (e) {
				rippleBtn.classList.add('fade');
				rippleBtn.classList.remove('rippling');
				setTimeout(function () {
					rippleBtn.classList.remove('fade');
				}, 300);
			});
		}
	});
});