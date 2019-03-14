 // console.clear;

var audioContext = null;
var meter = null;
var mediaStreamSource = null;
// var rafID = null;
var maxFontWeight = 900;
var minFontWeight = 100;
var scaleFactor = maxFontWeight * 5;
var vol = 0;
var canvas = document.getElementById("meter");
var canvasContext = canvas.getContext("2d");;
var WIDTH = document.documentElement.clientWidth;
var HEIGHT = document.documentElement.clientHeight;

var bar = {
	x: 0,
	y: 0,
	width: WIDTH,
	height: 0,
	fill: "#fff" };


function initAudioContext() {
	// monkeypatch Web Audio
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	// grab an audio context
	audioContext = new AudioContext();

	var constraints = { audio: true, video: false };

	navigator.mediaDevices.getUserMedia(constraints).
	then(function (stream) {
		gotStream(stream);
	}).
	catch(function (err) {console.log(err.name + ": " + err.message);}); // always check for errors at the end.

}

function gotStream(stream) {
	// Create an AudioNode from the stream.
	mediaStreamSource = audioContext.createMediaStreamSource(stream);

	// Create a new volume meter and connect it.
	meter = createAudioMeter(audioContext);
	mediaStreamSource.connect(meter);

	// kick off the visual updating
	TweenMax.ticker.addEventListener("tick", draw);
}

function draw(time) {
	// clear the background
	canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
	canvasContext.fillStyle = "#ffffff";



	// draw the circle
	//     canvasContext.beginPath();

	//     var radius = bar.height;
	//     canvasContext.arc(WIDTH/2, HEIGHT/2, radius, 0, Math.PI * 2, false);
	//     canvasContext.closePath();

	//     // color in the circle
	//     canvasContext.fillStyle = "#ffffff";
	//     canvasContext.fill();





	canvasContext.fillStyle = bar.fill;
	vol = meter.volume * scaleFactor;

	if (vol > maxFontWeight) {
		vol = maxFontWeight;
	} else if (vol < minFontWeight) {
		vol = minFontWeight;
	}

	// smooth out the bar animation
	TweenMax.to(bar, 0.8, {
		height: meter.volume * HEIGHT,
		ease: Expo.easeOut });

	// Animate the css var
	TweenMax.to(":root", 1, { "--myWeight": vol, ease: Expo.easeOut });
	TweenMax.to('.bg', 1, { opacity: meter.volume });

	canvasContext.fillRect(0, HEIGHT - bar.height * 2, WIDTH, bar.height * 2);
}

window.addEventListener("resize", resizeCanvas, false);

function resizeCanvas() {
	WIDTH = document.documentElement.clientWidth;
	HEIGHT = document.documentElement.clientHeight;
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
}

resizeCanvas();

// One-liner to resume playback when user interacted with the page.
document.querySelector("button").addEventListener("click", function () {
	initAudioContext();
	this.style.visibility = "hidden";
	// audioContext.resume().then(() => { 
	// 	console.log("Playback resumed successfully");
	// 	this.style.visibility = "hidden";
	// });
});

/*
    The MIT License (MIT)
    Copyright (c) 2014 Chris Wilson
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */

/*
       Usage:
       audioNode = createAudioMeter(audioContext,clipLevel,averaging,clipLag);
       audioContext: the AudioContext you're using.
       clipLevel: the level (0 to 1) that you would consider "clipping".
          Defaults to 0.98.
       averaging: how "smoothed" you would like the meter to be over time.
          Should be between 0 and less than 1.  Defaults to 0.95.
       clipLag: how long you would like the "clipping" indicator to show
          after clipping has occured, in milliseconds.  Defaults to 750ms.
       Access the clipping through node.checkClipping(); use node.shutdown to get rid of it.
       */

function createAudioMeter(audioContext, clipLevel, averaging, clipLag) {
	var processor = audioContext.createScriptProcessor(512);
	processor.onaudioprocess = volumeAudioProcess;
	processor.clipping = false;
	processor.lastClip = 0;
	processor.volume = 0;
	processor.clipLevel = clipLevel || 0.98;
	processor.averaging = averaging || 0.95;
	processor.clipLag = clipLag || 750;

	// this will have no effect, since we don't copy the input to the output,
	// but works around a current Chrome bug.
	processor.connect(audioContext.destination);

	processor.checkClipping = function () {
		if (!this.clipping) return false;
		if (this.lastClip + this.clipLag < window.performance.now())
		this.clipping = false;
		return this.clipping;
	};

	processor.shutdown = function () {
		this.disconnect();
		this.onaudioprocess = null;
	};

	return processor;
}

function volumeAudioProcess(event) {
	var buf = event.inputBuffer.getChannelData(0);
	var bufLength = buf.length;
	var sum = 0;
	var x;

	// Do a root-mean-square on the samples: sum up the squares...
	for (var i = 0; i < bufLength; i++) {
		x = buf[i];
		if (Math.abs(x) >= this.clipLevel) {
			this.clipping = true;
			this.lastClip = window.performance.now();
		}
		sum += x * x;
	}

	// ... then take the square root of the sum.
	var rms = Math.sqrt(sum / bufLength);

	// Now smooth this out with the averaging factor applied
	// to the previous sample - take the max here because we
	// want "fast attack, slow release."
	// this.volume = Math.max(rms, this.volume*this.averaging);
	this.volume = rms; // without the slow release using TweenMax instead
}