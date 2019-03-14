document.addEventListener("DOMContentLoaded", function(){
	const el = document.querySelector('.button');
	const el2 = document.querySelector('.button2');
	const on = document.querySelector('.on-wrapper');
	const on2 = document.querySelector('.on-wrapper2');
	const off = document.querySelector('.off-wrapper');
	const off2 = document.querySelector('.off-wrapper2');
	const body = document.querySelector('.wrapper-no6');
	const nav = document.querySelectorAll('.nav__item');

	if(on.classList.contains('first')){
		setTimeout(function(){ 
			on.classList.remove('first');
		}, 50);
	}

	function toggleClassButton(event){
		event.preventDefault();
		if(on.classList.contains('active')){
			on.classList.remove('active');
			on.classList.add('notactive');
			off.classList.add('active');
			off.classList.remove('notactive');
			body.classList.add('active');
		}else{
			off.classList.remove('active');
			off.classList.add('notactive');
			on.classList.add('active');
			on.classList.remove('notactive');
			body.classList.remove('active');
		}
	}
	function toggleClassButton2(event){
		event.preventDefault();
		on2.classList.toggle('active');
		off2.classList.toggle('active');
	}
	el.addEventListener('click', toggleClassButton);
	el2.addEventListener('click', toggleClassButton2);

	for (let i = 0, length = nav.length; i < length; i++){
		nav[i].addEventListener('click', function (event) {
			for (let x = 0, length = nav.length; x < length; x++){
				nav[x].classList.remove('active');
				body.classList.remove('v' + (x+1));
			}
			nav[i].classList.add('active');
			body.classList.add('v' + (i+1));
		});
	}
});