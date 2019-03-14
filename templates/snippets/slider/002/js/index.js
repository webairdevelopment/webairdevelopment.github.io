API('dwryqZ')

const steps = 6;

let current = {
	value: 3
};

let total = document.querySelector(".total");

const currentDiv = document.querySelector(".current");
const previousDiv = document.querySelector(".previous");
const nextDiv = document.querySelector(".next");

changeStep(2);
setTimeout(()=>{
	changeStep(5);
	setTimeout(()=>{
		changeStep(1);
	},1000)
},1500)

total.addEventListener("click", function(e) {
	let x = e.offsetX / (total.offsetWidth / (steps + 1));

	changeStep(x);
	
		TweenLite.to(currentDiv.style, 0.25, {
		ease: Power3.easeInOut,
		transform: "scale(1.5)",
		onComplete: () => {
			TweenLite.to(currentDiv.style, 0.75, {
				ease: Elastic.easeOut.config(1, 0.3),
				transform: "scale(1)"
			});
		}
	});
});

let isDown = false
total.addEventListener("mousedown", function(e) {
	isDown = true
// 		let x = e.offsetX / (total.offsetWidth / (steps + 1));

// 	changeStep(x);
	TweenLite.to(currentDiv.style, 0.25, {
		ease: Elastic.easeOut.config(1, 0.5),
		transform: "scale(1.5)"
	});
});

total.addEventListener("mousemove", function(e) {
	if(isDown) {
		let x = e.offsetX / (total.offsetWidth / (steps + 1));

		changeStep(x);
	}

});

total.addEventListener("mouseup", function(e) {
	isDown = false
	TweenLite.to(currentDiv.style, 0.5, {
		ease: Power3.easeInOut,
		transform: "scale(1)"
	});
});

function changeStep(x) {
	x = x * (total.offsetWidth / (steps + 1));
	TweenLite.to(currentDiv.style, 0.75, {
		ease: Elastic.easeOut.config(1, 0.5),
		left: x - 16 + "px"
	});

	// currentDiv.style.left = x + 16 + 'px'

	if ((x-32) < 0.1) {
		console.log('error')
		TweenLite.to(previousDiv.style, 0.12, {
			ease: Power4.easeOut,
			width: Math.max(x - 32,0) + "px"
		});
	} else {
		TweenLite.to(previousDiv.style, 0.75, {
			ease: Elastic.easeOut.config(1, 0.5),
			width: Math.max(x - 32,0) + "px"
		});
	}

	// previousDiv.style.width = x + 'px'

	if (total.offsetWidth - x - 24 < 0) {
		TweenLite.to(nextDiv.style, 0.12, {
			ease: Power4.easeOut,
			width: Math.max(total.offsetWidth - x - 24, 0) + "px"
		});
	} else {
		TweenLite.to(nextDiv.style, 0.75, {
			ease: Elastic.easeOut.config(1, 0.5),
			width: Math.max(total.offsetWidth - x - 24, 0) + "px"
		});
	}

	// nextDiv.style.width = Math.max((total.offsetWidth - x) - 58,0) + 'px'
}