var ColorPalettes = [
['#d1e751', '#ffffff', '#000000', '#4dbce9', '#26ade4'],
['#a1dbb2', '#fee5ad', '#faca66', '#f7a541', '#f45d4c'],
['#ff4e50', '#fc913a', '#f9d423', '#ede574', '#e1f5c4'],
['#fad089', '#ff9c5b', '#f5634a', '#ed303c', '#3b8183'],
['#d1313d', '#e5625c', '#f9bf76', '#8eb2c5', '#615375'],
['#F5F2E1', '#F5D549', '#F2B338', '#F5732A', '#D92B29']];

var eases = [
Elastic.easeOut,
Back.easeOut,
Power0.easeOut,
Power1.easeOut,
Power2.easeOut,
Power3.easeOut,
Power4.easeOut,
Sine.easeOut];

var settings = {
    particleCount: isMobile.phone ? 2000 : 3000,
    lineLength: isMobile.phone ? 5 : 10,
    lineGrowth: isMobile.phone ? 25 : 50,
    lineWidth: 1,
    ColorPaletteId: 0,
    minDistance: 0,
    maxDistance: isMobile.phone ? 150 : 200,
    distanceGrowth: 0,
    mouseDownGrowth: isMobile.phone ? 50 : 150,
    mouseDownTiming: 1,
    mouseDownEase: 0,
    glow: true,
    motionBlur: false,
    lookAtMouse: false,
    stats: false };

var particlePropCount = 6;
var padding = 100;
var gui = new dat.GUI();
var particlePropsLength = settings.particleCount * particlePropCount;
var particleProps = void 0;
var canvas = void 0;
var screen = void 0;
var screenCtx = void 0;
var ctx = void 0;
var center = [];
var mouse = [window.innerWidth * 0.5, window.innerHeight * 0.5];
var stats = new Stats();

function init() {
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("touchmove", touchMove);
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("touchstart", mouseDown);
    window.addEventListener("touchend", mouseUp);
    buildCanvas();
    buildGui();
    resize();
    render();
}

function buildCanvas() {
    canvas = document.createElement("canvas");
    screen = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    screenCtx = screen.getContext("2d");
    document.body.appendChild(screen);
    if (settings.stats) document.body.appendChild(stats.dom);
}

function buildGui() {
    gui.closed = true;
    gui.add(settings, "lineWidth", 1, 10);
    gui.add(settings, "lineLength", 1, 100);
    gui.add(settings, "lineGrowth", 1, 100);
    var particleController = gui.add(settings, "particleCount", 100, 10000);
    gui.add(settings, "ColorPaletteId", 0, 5).step(1);
    gui.add(settings, "minDistance", 0, 200);
    gui.add(settings, "maxDistance", 10, window.innerWidth);
    gui.add(settings, "mouseDownGrowth", 0, 500);
    gui.add(settings, "mouseDownTiming", 0.1, 3).listen();
    var easeController = gui.add(settings, "mouseDownEase", {
        Elastic: 0,
        Back: 1,
        Power0: 2,
        Power1: 3,
        Power2: 4,
        Power3: 5,
        Power4: 6,
        Sine: 7 });

    gui.add(settings, "lookAtMouse");
    gui.add(settings, "glow");
    gui.add(settings, "motionBlur");
    var statsController = gui.add(settings, "stats");
    particleController.onFinishChange(function (value) {
        particlePropsLength = value * particlePropCount;
        initLines();
    });
    statsController.onChange(function (value) {
        if (value) {
            document.body.appendChild(stats.dom);
        } else {
            stats.dom.remove();
        }
    });
    easeController.onChange(function (value) {
        if (value == 0) {
            settings.mouseDownTiming = 1.0;
        } else {
            settings.mouseDownTiming = 0.35;
        }
    });
}

function initLines() {
    particleProps = new Float32Array(particlePropsLength);
    var i = void 0;
    for (i = 0; i < particlePropsLength; i += particlePropCount) {
        initLine(i);
    }
}

function initLine(i) {
    var x = randomFloat(-padding, canvas.width + padding);
    var y = randomFloat(-padding, canvas.height + padding);
    var x2 = x;
    var y2 = y;
    var rotation = 0;
    var color = randomInt(0, 4);
    particleProps.set([x, y, rotation, color, x2, y2], i);
}

function mouseMove(event) {
    mouse[0] = event.clientX;
    mouse[1] = event.clientY;
}

function touchMove(event) {
    mouse[0] = event.touches[0].clientX;
    mouse[1] = event.touches[0].clientY;
}

function mouseDown() {
    TweenMax.to(settings, settings.mouseDownTiming, {
        distanceGrowth: settings.mouseDownGrowth,
        ease: eases[settings.mouseDownEase] });

}

function mouseUp() {
    TweenMax.to(settings, settings.mouseDownTiming, {
        distanceGrowth: 0,
        ease: eases[settings.mouseDownEase] });

}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    screen.width = window.innerWidth;
    screen.height = window.innerHeight;
    center[0] = 0.5 * canvas.width;
    center[1] = 0.5 * canvas.height;
    initLines();
}

function drawLines() {
    var i = void 0;
    for (i = 0; i < particlePropsLength; i += particlePropCount) {
        updateLine(i);
    }
}

function updateLine(i) {
    var i2 = 1 + i;
    var i3 = 2 + i;
    var i4 = 3 + i;
    var i5 = 4 + i;
    var i6 = 5 + i;
    var x = void 0,y = void 0,rotation = void 0,color = void 0,x2 = void 0,y2 = void 0,distance = void 0;
    x = particleProps[i];
    y = particleProps[i2];
    rotation = anglePoints(x, y, mouse[0], mouse[1]);
    color = particleProps[i4];
    distance = map(distanceTo(x, y, mouse[0], mouse[1]), settings.minDistance, settings.maxDistance + settings.distanceGrowth, settings.lineGrowth, 0);
    var l = settings.lineLength + distance;
    var vx = settings.lookAtMouse ? Math.cos(rotation) : -Math.cos(rotation);
    var vy = settings.lookAtMouse ? Math.sin(rotation) : -Math.sin(rotation);
    x2 = x + l * vx;
    y2 = y + l * vy;
    particleProps[i3] = rotation;
    particleProps[i5] = x2;
    particleProps[i6] = y2;
    drawLine(x, y, x2, y2, rotation, color);
}

function drawLine(x, y, x2, y2, rotation, color) {
    ctx.lineWidth = settings.lineWidth;
    ctx.lineCap = "rounded";
    ctx.strokeStyle = ColorPalettes[settings.ColorPaletteId][color];
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function drawCanvas() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    screenCtx.fillStyle = 'hsla(220,60%,3%,' + (settings.motionBlur ? 0.1 : 1) + ')';
    screenCtx.fillRect(0, 0, canvas.width, canvas.height);
}

function renderGlow() {
    screenCtx.save();
    screenCtx.filter = 'blur(8px) brightness(200%)';
    screenCtx.globalCompositeOperation = 'lighter';
    screenCtx.drawImage(canvas, 0, 0);
    screenCtx.restore();

    screenCtx.save();
    screenCtx.filter = 'blur(4px) brightness(200%)';
    screenCtx.globalCompositeOperation = 'lighter';
    screenCtx.drawImage(canvas, 0, 0);
    screenCtx.restore();
}

function renderToScreen() {
    screenCtx.save();
    if (settings.glow) screenCtx.globalCompositeOperation = "lighter";
    screenCtx.drawImage(canvas, 0, 0);
    screenCtx.restore();
}

function render() {
    stats.begin();
    drawCanvas();
    drawLines();
    if (settings.glow) renderGlow();
    renderToScreen();
    stats.end();
    requestAnimationFrame(render);
}


//HELPERS
var rand = function rand(n) {return n * Math.random();};

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return min + Math.floor(Math.random() * (max + 1 - min));
}

function anglePoints(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

function normalize(value, min, max) {
    return (value - min) / (max - min);
}

function interpolate(value, min, max) {
    return min + (max - min) * value;
}

function map(value, min1, max1, min2, max2) {
    return interpolate(normalize(value, min1, max1), min2, max2);
}

function distanceTo(x1, y1, x2, y2) {
    return Math.sqrt(distanceToSquared(x1, y1, x2, y2));
}

function distanceToSquared(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return dx * dx + dy * dy;
}

function randomFloat(min, max) {
    return min + Math.random() * (max - min);
}

window.addEventListener("load", init);