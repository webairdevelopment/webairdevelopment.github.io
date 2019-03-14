function Random(range) {
    return Math.floor((Math.random() * range) + 1);
}
function RandomFloat(range) {
    return (Math.random() * range) + 1;
}
var canvas = document.getElementById('drawing-surface');
var context = canvas.getContext('2d');
var fireBall = {
    x: (window.innerWidth / 2) + 20,
    y: (window.innerHeight / 2) + 20,
    wind: 0
};
var viewport = new Viewport();
var particleArr = [];
for (var i = 0; i < 50; i++) {
    var particle = new Particle();
    particleArr.push(particle);
    viewport.addObject(particle);
}

viewport.init();

function Viewport() {
    var me = this;
    me.objects = [];
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.onresize = function () {
        resizeCanvas();
    }
    var context = document.getElementById("drawing-surface").getContext("2d");
    me.doPaint = true;
    function drawBackgroundImage() {
        context.globalAlpha = 1;
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    function drawObjects() {
        context.save();
        context.beginPath();
        context.arc(fireBall.x - 20, fireBall.y, 200, 0, 2 * Math.PI);
        context.clip();
        var img = document.getElementById('scream');
        context.drawImage(img,0,0, window.innerWidth, window.innerHeight);
        context.beginPath();
        context.arc(fireBall.x - 20, fireBall.y, 200, 0, Math.PI * 2)
        context.strokeStyle = "rgba(0,0,0,.75)"
        context.lineWidth = 20;
        context.stroke();
        context.beginPath();
        context.arc(fireBall.x - 20, fireBall.y, 183, 0, Math.PI * 2)
        context.strokeStyle = "rgba(0,0,0,.5)"
        context.lineWidth = 15;
        context.stroke();
        context.beginPath();
        context.arc(fireBall.x - 20, fireBall.y, 171, 0, Math.PI * 2)
        context.strokeStyle = "rgba(0,0,0,.25)"
        context.lineWidth = 10;
        context.stroke();
        drawTorchHandle();
        for (var i = 0; i < me.objects.length; i++) {
            me.objects[i].paint(context);
        }
        console.log(fireBall.x + ', ' + fireBall.y);
        context.restore();
        
    }
    me.paintInit = function () {
        me.doPaint = true;
    }
    function paint() {
        me.paintInit();
        if (me.doPaint) {
            drawBackgroundImage();
            drawObjects();
            me.doPaint = false;
        }
    }
    var timer;
    me.init = function () {
        timer = setInterval(function () { paint(); }, 1000 / 30);
    };
    me.repaint = function () {
        me.doPaint = true;
    };
    me.addObject = function (obj) {
        me.objects.push(obj);
    }
    me.removeObject = function() {
        me.objects.pop();
    }
}

function Particle() {
    var me = this;
    console.log(this);
    var source = {};
    source.location = { x: fireBall.x, y: fireBall.y };
    me.reset = function () {
        me.wind = fireBall.wind;
        me.speed = RandomFloat(5) - 6.5;
        me.radius = 10;
        me.opacity = 255;
        me.greenFactor = 255;
        me.color = 'rgb(255,255,0)';
        me.location = { x: fireBall.x - RandomFloat(40), y: fireBall.y };
    };
    me.reset();
    me.move = function () {
        if ( me.radius <= 1) {
            me.reset();
        }
        me.radius += 20 / (300 / me.speed);
        me.opacity += 255 / (300 / me.speed);
        me.greenFactor += 255 / ((300 * 2) / me.speed);
        me.color = "rgb(255," + (Math.floor(me.greenFactor) + 1) + ",0)";
        me.location.x += me.wind;
        me.location.y += me.speed;
    };
    me.paint = function (context) {
        me.move();
        context.beginPath();
        context.arc(me.location.x, me.location.y, me.radius, 0, 2 * Math.PI, false);
        context.fillStyle = me.color;
        context.globalAlpha = me.opacity / 255;
        context.fill();
        context.closePath();
        /* context.beginPath();
        context.arc(fireBall.x, fireBall.y, 200, 0, 2 * Math.PI);
        context.stroke() */
    };
}

function drawTorchHandle() {
    var startX =  fireBall.x - 25;
    var startY =  fireBall.y + 120;
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(startX, startY - 77);
    context.lineTo(startX - 18, startY - 101);   
    context.lineTo(startX + 32, startY - 101);
    context.lineTo(startX + 14, startY - 77);
    context.lineTo(startX + 14, startY);
    context.lineTo(startX, startY);
    context.closePath();
    context.fillStyle = '#472900';
    context.fill();
    context.fillStyle = 'gray';
    context.fillRect(startX - 1, startY - 60, 16, 10);
    context.fillRect(startX - 1, startY - 20, 16, 10);
}

var lastMouse = {
    x: fireBall.x,
    y: fireBall.y
}

canvas.addEventListener('mousemove', function(e) {
    lastMouse = fireBall;
    fireBall.x = e.clientX + 20;
    fireBall.y = e.clientY - 50;
    if ( lastMouse.x > fireBall.x) {
        fireBall.wind = (lastMouse.x - fireBall.x + 5);
    } else if ( lastMouse.x < fireBall.x) {
        fireBall.wind = -(fireBall.x - lastMouse.x + 5);
    }
});