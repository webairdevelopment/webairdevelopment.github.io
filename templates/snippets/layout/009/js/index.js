let adSticky = stickybits(".js-ad-sticky", {
	parentClass: "js-ad-sticky-parent",
	stickyBitStickyOffset: window.innerHeight - 100
});

const ad = document.querySelector(".js-ad-section");
let circle = document.querySelector(".js-arrow-svg circle");

function adReadingProgress() {
	let val =
		(window.innerHeight + window.pageYOffset - ad.offsetTop - 120) /
		(ad.clientHeight - 100) *
		100;

	const r = circle.r.baseVal.value;
	const c = Math.PI * (r * 2);
	if (val < 0) {
		val = 0;
	}
	if (val > 100) {
		val = 100;
	}

	const pct = (100 - val) / 100 * c;

	circle.style.strokeDashoffset = pct;

	requestAnimationFrame(() => this.adReadingProgress());
}

window.requestAnimationFrame(adReadingProgress);