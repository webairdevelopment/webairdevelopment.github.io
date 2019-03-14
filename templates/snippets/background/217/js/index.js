let width, height;
const zoom = 80;
const lineWidth = zoom / 5;
const borderLineWidth = lineWidth * 1.3;
const foregroundColors = ["#fa0", "#f0a", "#af0", "#a0f", "#0fa", "#0af"];
const backgroundColor = "#f5f5f5";
const borderColor = "#333";
const N = "N", E = "E", S = "S", W = "W", NE = "NE", SE = "SE", SW = "SW", NW = "NW", V = "V", H = "H";
const PI = Math.PI;
const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");
const random = n => Math.random() * n | 0;
const randomColor = () => foregroundColors[random(foregroundColors.length)];
const shuffleRender = (q) => {
	const order = [];
	for (let i = 0; i < q.length; ++i) 
		order.splice(random(order.length) + 1, 0, i);
	for (let i = 0; i < q.length; ++i) 
		q[order[i]]();
};
const arc = (x, y, r, s, e, b) => {
	ctx.beginPath();
	ctx.strokeStyle = b ? borderColor : randomColor();
	ctx.lineWidth = b ? borderLineWidth : lineWidth;
	ctx.arc(x * zoom, y * zoom, zoom * r, s, e);
	ctx.stroke();
};
const line = (x0, y0, x1, y1, b) => {
	ctx.beginPath();
	ctx.strokeStyle = b ? borderColor : randomColor();
	ctx.lineWidth = b ? borderLineWidth : lineWidth;
	ctx.moveTo(x0 * zoom, y0 * zoom);
	ctx.lineTo(x1 * zoom, y1 * zoom);
	ctx.stroke();
};
const shadedArc = (x, y, r, s, e) => {
	arc(x, y, r, s, e, true);
	arc(x, y, r, s, e);
};
const shadedLine = (x0, y0, x1, y1) => {
	line(x0, y0, x1, y1, true);
	line(x0, y0, x1, y1);
};
const cornerArc = (c, r, ra, d) => {
	switch (d) {
		case NE:
			shadedArc(c + 1, r, ra, PI / 2, PI);
			break;
		case SE:
			shadedArc(c + 1, r + 1, ra, PI, PI / 2 * 3);
			break;
		case SW:
			shadedArc(c, r + 1, ra, PI / 2 * 3, 0);
			break;
		default:
			shadedArc(c, r, ra, 0, PI / 2);
	}
};
const edgeArc = (c, r, ra, d) => {
	switch (d) {
		case N:
			shadedArc(c + 1 / 2, r, ra, 0, PI);
			break;
		case E:
			shadedArc(c + 1, r + 1 / 2, ra, PI / 2, PI / 2 * 3);
			break;
		case S:
			shadedArc(c + 1 / 2, r + 1, ra, PI, 0);
			break;
		default:
			shadedArc(c, r + 1 / 2, ra, PI / 2 * 3, PI / 2);
	}
};
const renderTile0 = (c, r) => {
	cornerArc(c, r, 1 / 3, NE);
	cornerArc(c, r, 1 / 3, SE);
	cornerArc(c, r, 1 / 3, SW);
	cornerArc(c, r, 1 / 3, NW);
};
const renderTile1 = (c, r) => {
	edgeArc(c, r, 1 / 6, N);
	edgeArc(c, r, 1 / 6, E);
	edgeArc(c, r, 1 / 6, S);
	edgeArc(c, r, 1 / 6, W);
};
const renderTile2 = (c, r) => {
	switch (random(4)) {
		case 0:
			cornerArc(c, r, 1 / 3, NE);
			cornerArc(c, r, 2 / 3, NE);
			edgeArc(c, r, 1 / 6, S);
			edgeArc(c, r, 1 / 6, W);
			break;
		case 1:
			cornerArc(c, r, 1 / 3, SE);
			cornerArc(c, r, 2 / 3, SE);
			edgeArc(c, r, 1 / 6, W);
			edgeArc(c, r, 1 / 6, N);
			break;
		case 2:
			cornerArc(c, r, 1 / 3, SW);
			cornerArc(c, r, 2 / 3, SW);
			edgeArc(c, r, 1 / 6, N);
			edgeArc(c, r, 1 / 6, E);
			break;
		default:
			cornerArc(c, r, 1 / 3, NW);
			cornerArc(c, r, 2 / 3, NW);
			edgeArc(c, r, 1 / 6, E);
			edgeArc(c, r, 1 / 6, S);
	}
};
const renderTile3 = (c, r) => {
	switch (random(4)) {
		case 0:
			cornerArc(c, r, 1 / 3, NW);
			cornerArc(c, r, 2 / 3, NW);
			cornerArc(c, r, 1 / 3, SE);
			cornerArc(c, r, 2 / 3, SE);
			break;
		case 1:
			cornerArc(c, r, 1 / 3, SE);
			cornerArc(c, r, 2 / 3, SE);
			cornerArc(c, r, 1 / 3, NW);
			cornerArc(c, r, 2 / 3, NW);
			break;
		case 2:
			cornerArc(c, r, 1 / 3, NE);
			cornerArc(c, r, 2 / 3, NE);
			cornerArc(c, r, 1 / 3, SW);
			cornerArc(c, r, 2 / 3, SW);
			break;
		default:
			cornerArc(c, r, 1 / 3, NE);
			cornerArc(c, r, 2 / 3, NE);
			cornerArc(c, r, 1 / 3, SW);
			cornerArc(c, r, 2 / 3, SW);
	}
};
const renderTile4 = (c, r) => {
	switch (random(2)) {
		case 0:
			shuffleRender([
				() => shadedLine(c + 1 / 3, r, c + 1 / 3, r + 1),
				() => shadedLine(c + 2 / 3, r, c + 2 / 3, r + 1),
				() => edgeArc(c, r, 1 / 6, E),
				() => edgeArc(c, r, 1 / 6, W)
			]);
			break;
		default:
			shuffleRender([
				() => shadedLine(c, r + 1 / 3, c + 1, r + 1 / 3),
				() => shadedLine(c, r + 2 / 3, c + 1, r + 2 / 3),
				() => edgeArc(c, r, 1 / 6, N),
				() => edgeArc(c, r, 1 / 6, S)
			]);
	}
};
const renderTile5 = (c, r) => {
	shuffleRender([
		() => shadedLine(c, r + 1 / 3, c + 1, r + 1 / 3),
		() => shadedLine(c, r + 2 / 3, c + 1, r + 2 / 3),
		() => shadedLine(c + 1 / 3, r, c + 1 / 3, r + 1),
		() => shadedLine(c + 2 / 3, r, c + 2 / 3, r + 1)
	]);
};
const renderTile6 = (c, r) => {
	switch(random(4)) {
		case 0:
			shuffleRender([
				() => shadedLine(c, r + 1 / 3, c + 1, r + 1 / 3),
				() => shadedLine(c + 1 / 3, r, c + 1 / 3, r + 1),
				() => cornerArc(c, r, 1 / 3, SE),
				() => cornerArc(c, r, 2 / 3, NW)
			]);
			break;
		case 1:
			shuffleRender([
				() => shadedLine(c, r + 2 / 3, c + 1, r + 2 / 3),
				() => shadedLine(c + 2 / 3, r, c + 2 / 3, r + 1),
				() => cornerArc(c, r, 1 / 3, NW),
				() => cornerArc(c, r, 2 / 3, SE)
			]);
			break;
		case 2:
			shuffleRender([
				() => shadedLine(c, r + 1 / 3, c + 1, r + 1 / 3),
				() => shadedLine(c + 2 / 3, r, c + 2 / 3, r + 1),
				() => cornerArc(c, r, 2 / 3, NE),
				() => cornerArc(c, r, 1 / 3, SW)
			]);
			break;
		default:
			shuffleRender([
				() => shadedLine(c, r + 2 / 3, c + 1, r + 2 / 3),
				() => shadedLine(c + 1 / 3, r, c + 1 / 3, r + 1),
				() => cornerArc(c, r, 1 / 3, NE),
				() => cornerArc(c, r, 2 / 3, SW)
			]);
	}
};
const renderTile7 = (c, r) => {
	switch(random(4)) {
		case 0:
			shuffleRender([
				() => shadedLine(c, r + 1 / 3, c + 1, r + 1 / 3),
				() => edgeArc(c, r, 1 / 6, N),
				() => cornerArc(c, r, 1 / 3, SE),
				() => cornerArc(c, r, 1 / 3, SW)
			]);
			break;
		case 1:
			shuffleRender([
				() => shadedLine(c, r + 2 / 3, c + 1, r + 2 / 3),
				() => edgeArc(c, r, 1 / 6, S),
				() => cornerArc(c, r, 1 / 3, NE),
				() => cornerArc(c, r, 1 / 3, NW)
			]);
			break;
		case 2:
			shuffleRender([
				() => shadedLine(c + 1 / 3, r, c + 1 / 3, r + 1),
				() => edgeArc(c, r, 1 / 6, W),
				() => cornerArc(c, r, 1 / 3, NE),
				() => cornerArc(c, r, 1 / 3, SE)
			]);
			break;
		default:
			shuffleRender([
				() => shadedLine(c + 2 / 3, r, c + 2 / 3, r + 1),
				() => edgeArc(c, r, 1 / 6, E),
				() => cornerArc(c, r, 1 / 3, NW),
				() => cornerArc(c, r, 1 / 3, SW)
			]);
	}
};
const renderTile8 = (c, r) => {
	switch(random(4)) {
		case 0:
			shuffleRender([
				() => shadedLine(c, r + 2 / 3, c + 1, r + 2 / 3),
				() => edgeArc(c, r, 1 / 6, N),
				() => cornerArc(c, r, 2 / 3, SE),
				() => cornerArc(c, r, 2 / 3, SW)
			]);
			break;
		case 1:
			shuffleRender([
				() => shadedLine(c, r + 1 / 3, c + 1, r + 1 / 3),
				() => edgeArc(c, r, 1 / 6, S),
				() => cornerArc(c, r, 2 / 3, NE),
				() => cornerArc(c, r, 2 / 3, NW)
			]);
			break;
		case 2:
			shuffleRender([
				() => shadedLine(c + 2 / 3, r, c + 2 / 3, r + 1),
				() => edgeArc(c, r, 1 / 6, W),
				() => cornerArc(c, r, 2 / 3, NE),
				() => cornerArc(c, r, 2 / 3, SE)
			]);
			break;
		default:
			shuffleRender([
				() => shadedLine(c + 1 / 3, r, c + 1 / 3, r + 1),
				() => edgeArc(c, r, 1 / 6, E),
				() => cornerArc(c, r, 2 / 3, NW),
				() => cornerArc(c, r, 2 / 3, SW)
			]);
	}
};
const renderTile = (c, r) => {
	switch (random(9)) {
		case 0:
			renderTile0(c, r);
			break;
		case 1:
			renderTile1(c, r);
			break;
		case 2:
			renderTile2(c, r);
			break;
		case 3:
			renderTile3(c, r);
			break;
		case 4:
			renderTile4(c, r);
			break;
		case 5:
			renderTile5(c, r);
			break;
		case 6:
			renderTile6(c, r);
			break;
		case 7:
			renderTile7(c, r);
			break;
		default:
			renderTile8(c, r);
	}
};
const render = () => {
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, width, height);
	for (let r = 0; r < height / zoom; ++r)
		for (let c = 0; c < width / zoom; ++c) 
			renderTile(c, r);
};
const resize = () => {
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
	render();
};
window.onresize = resize;
canvas.onclick = render;
resize();