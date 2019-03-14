window.onload = () => {
	
	const btns = document.querySelectorAll('.btn');
	
	btns.forEach(btn => btn.addEventListener('click', e => {
		const currBtn = e.target;
		if(currBtn.children.length > 0)
			return;

		const div = document.createElement('div');
		div.classList.add('movingStripes');
		
		currBtn.classList.add('btnOnClick');
		currBtn.innerHTML = "Loading..";
		currBtn.appendChild(div);
		
		setTimeout(() => {
			currBtn.removeChild(div);
			currBtn.innerHTML = "Click me";
			currBtn.classList.remove('btnOnClick');
		}, 3500);

	}));

}