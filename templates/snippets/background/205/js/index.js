"use strict";
let mtx, w, h, W, H, sx, sy;
const ongoingTouches = [];
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d", { lowLatency: true, alpha: false });
const resize = () => {
	w = canvas.offsetWidth;
	h = canvas.offsetHeight;
	const S = Math.floor(Math.max(w, h) / 80);
	W = Math.floor(w / S);
	H = Math.floor(h / S);
	sx = (w / W) | 0;
	sy = (h / H) | 0;
	canvas.width = W * sx;
	canvas.height = H * sy;
	mtx = new Uint16Array(H * W);
}
window.addEventListener("resize", resize, false);
resize();
for (let x = 1; x < W; x++) mtx[x * H + Math.floor(H / 2)] = 16000;
//////////////////// plasma //////////////////////
const plasma = () => {
	requestAnimationFrame(plasma);
	for (const t of ongoingTouches) {
		if (t.x > 0 && t.x < W - 1 && t.y > 0 && t.y < H - 1) {
			mtx[t.x * H + t.y] = 8192;
		}
	}
	for (let dx = 0; dx < W; dx++) {
		for (let dy = 1; dy < H - 1; dy++) {
			const p = dx * H + dy;
			const nc = (
				mtx[(dx - 1) * H + dy - 1] +
				mtx[(dx - 1) * H + dy] +
				mtx[(dx - 1) * H + dy + 1] +
				mtx[dx * H + dy + 1] +
				mtx[dx * H + dy - 1] +
				mtx[(dx + 1) * H + dy] +
				mtx[(dx + 1) * H + dy - 1] +
				mtx[(dx + 1) * H + dy + 1]
			) /	8;
			mtx[p] = nc;
			if (nc > 8) {
				ctx.fillStyle = `rgb(
					${Math.round(nc)}, 
					${Math.round(nc * 0.45)},
					${Math.round(nc * nc * nc * 0.000001)}
				)`;
				ctx.fillRect(dx * sx, dy * sy, sx, sy);
			}
		}
	}
};
///////////////// multi-touch //////////////////
const down = e => {
	if (e.type.substring(0, 5) === "touch") {
		e.preventDefault();
		const touches = e.changedTouches;
		for (let i = 0; i < touches.length; i++) {
			const t = touches[i];
			ongoingTouches.push({
				id: t.identifier,
				x: Math.floor(t.clientX / sx) + 1,
				y: Math.floor(t.clientY / sy)
			});
		}
	} else {
		ongoingTouches.push({
			id: 99,
			x: Math.floor(e.clientX / sx) + 1,
			y: Math.floor(e.clientY / sy)
		});
	}
};
const move = e => {
	if (e.type.substring(0, 5) === "touch") {
		e.preventDefault();
		var touches = e.changedTouches;
		for (let i = 0; i < touches.length; i++) {
			const touch = ongoingTouches.find(t => t.id === touches[i].identifier);
			if (touch !== undefined) {
				touch.x = Math.floor(touches[i].clientX / sx) + 1;
				touch.y = Math.floor(touches[i].clientY / sy)
			}
		}
	} else {
		const touch = ongoingTouches.find(t => t.id === 99);
		if (touch !== undefined) {
			touch.x = Math.floor(e.clientX / sx) + 1;
			touch.y = Math.floor(e.clientY / sy);
		}
	}
}
const up = e => {
	if (e.type.substring(0, 5) === "touch") {
		e.preventDefault();
		const touches = e.changedTouches;
		for (let i = 0; i < touches.length; i++) {
			const id = ongoingTouches.findIndex(t => t.id === touches[i].identifier);
			if (id >= 0) ongoingTouches.splice(id, 1);
		}
	} else {
		const id = ongoingTouches.findIndex(t => t.id === 99);
		if (id >= 0) ongoingTouches.splice(id, 1);
	}
}
window.addEventListener("mousemove", move, false);
window.addEventListener("mousedown", down, false);
window.addEventListener("mouseup", up, false);
canvas.addEventListener("touchstart", down, false);
canvas.addEventListener("touchend", up, false);
canvas.addEventListener("touchcancel", up, false);
canvas.addEventListener("touchmove", move, false);
/////////////////////////////////////////////////
plasma();