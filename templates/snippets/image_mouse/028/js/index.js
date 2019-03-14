const btn = document.querySelector("button");
const h1 = document.querySelector("h1");
const classes = ["nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "seventeen"];
const ages = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
let num = 0;

btn.addEventListener("click", function() {
	if (num > 7) {
		num = -1;
		btn.classList.remove(classes[9]);
	}
	
	btn.classList.remove(classes[num]);
	btn.classList.add(classes[num + 1]);
	h1.innerHTML= ages[num + 1];
	num++;
})

document.addEventListener("touchstart", function() {
},false);