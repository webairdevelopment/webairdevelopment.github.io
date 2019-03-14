// if value is above a certain amount - update beat

// pipe value into brightness

console.clear();

// some utility functions
const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

// at some point refactor this to use viz colours
// const colourPalette =

//~~~~~~~~~~~~~~~~~~~~~~~~~SOUNDCLOUD STUFF
// Massive thanks to @jake_albaugh for letting me use his key. Also a lot of the soundcloud stuff is influenced by https://codepen.io/jakealbaugh/pen/MyJXoK?editors=0010 which you should check out!
const track_id = "433074246";
const client_id = "787c22af89922d1be9202d2f0cc90586";
const src_url = "https://api.soundcloud.com/tracks/" + track_id + "/stream?client_id=" + client_id;
const controls = document.querySelector('button');
let track = new Audio();
track.crossOrigin = "anonymous";

function initTrack(url, trackInstance) {
	let trackInst = trackInstance;
	trackInst.src = url;
	trackInst.crossOrigin = "anonymous";
	trackInst.play();
}

function playPause(playing, trackInstance) {
	let trackInst = trackInstance;
	if (playing) {
		trackInst.pause();
	} else {
		trackInst.play();
	}
}

controls.addEventListener("click", function() {

	// check if context is in suspended state (autoplay policy)
	if (audCtx.state === 'suspended') {
		audCtx.resume();
	}

	this.classList.toggle('button--on');

	// first click - initiate soundcloud call
	if (this.dataset.playing === 'null') {
		initTrack(src_url, track);
		this.dataset.playing = "true";
		// and set up audio graph
		connectGraph(audCtx, track, analyserNode);
	} else { // toggle play
		let play = this.dataset.playing === "true" ? true : false;
		this.dataset.playing = this.dataset.playing === "true" ? "false" : "true";
		playPause(play, track);
	}

}, false);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ AUDIO STUFF
// set up audio canCtx & analyser
const binSize = 2048;
let bin = new Uint8Array(binSize);
const audCtx = new (window.AudioContext || window.webkitAudioContext);
const analyserNode = new AnalyserNode(audCtx, {
  fftSize: binSize*2,
  maxDecibels: -25,
  minDecibels: -60,
  smoothingTimeConstant: 0.5,
});

function connectGraph(ctx, trackInstance, node) {
	let trackInst = trackInstance,
			audioCtx = ctx,
			analyserNode = node;
	const source = audioCtx.createMediaElementSource(trackInst);
	source.connect(analyserNode).connect(audioCtx.destination);
}

function analyse(node) {
	let analyserNode = node;
	analyserNode.getByteFrequencyData(bin);
	// console.log(bin);
}

// visual setup
const beatThreshold = 30; // average gain for change
const debounceRate = 20; // lower = higher frame count
let debounce = 0;
let directions = [-1, 0, 1];

function draw() {
	requestAnimationFrame(draw);
	analyse(analyserNode);
	let newBin = bin.slice(0, binSize/16);
	
	// if the first half of the array averages over 200, change lines
	let binAvg = arrAvg(newBin);

	document.documentElement.style.setProperty('--bright', binAvg+20);
	
	if ( (binAvg > beatThreshold) && (debounce === 0) ) {
		document.documentElement.style.setProperty('--beat', binAvg);
		// startSteps === 4 ? startSteps = 2 : startSteps++;
		debounce = debounceRate;
	}
	debounce > 0 ? debounce-- : debounce = 0;


}

draw();