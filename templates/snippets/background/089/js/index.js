var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var onecolor = one.color;var

BannerWorld = function () {
    function BannerWorld() {_classCallCheck(this, BannerWorld);
        this._ballFD = {
            density: 1.0,
            friction: 0.6 };


        this._world = new planck.World({
            gravity: planck.Vec2(0.1, 0) });


        this._ground = this._world.createBody();
        this._ground.createFixture(planck.Edge(planck.Vec2(-0.1, -50), planck.Vec2(-0.1, 50)), {
            density: 0,
            friction: 0.6 });


        this._bodyList = [];
        this._startingDirection = 1;

        this._spawnCountdown = 0;
    }_createClass(BannerWorld, [{ key: 'step', value: function step(

        dt) {var _this = this;
            var world = this._world;
            var bodyList = this._bodyList;

            // spawn new bodies
            this._spawnCountdown -= dt;

            if (this._spawnCountdown < 0) {
                // check if spawn area is too crowded
                var readyForSpawn = bodyList.length === 0 || bodyList[bodyList.length - 1].getPosition().x - bodyList[bodyList.length - 1].data.radius > 0.6;

                if (readyForSpawn) {
                    this._spawnCountdown += 0.4;

                    var radius = 0.3;
                    var body = world.createDynamicBody(planck.Vec2(radius, this._startingDirection * (-radius + Math.random() * 0.1)));
                    var fixture = body.createFixture(planck.Circle(radius), this._ballFD);
                    body.setLinearVelocity(planck.Vec2(1.2, this._startingDirection * (0.5 + Math.random() * 1.5)));

                    body.data = {
                        prevJoint: null,
                        nextJoint: null,
                        sizeCountdown: 0,
                        radius: radius,
                        fixture: fixture };


                    if (bodyList.length > 0) {
                        var prevBody = bodyList[bodyList.length - 1];

                        // @todo consider also a rotation joint to keep folds in the right order
                        prevBody.data.nextJoint = body.data.prevJoint = world.createJoint(planck.DistanceJoint({
                            collideConnected: true, // rigid minimum distance
                            frequencyHz: 0.2,
                            dampingRatio: 0.5,
                            bodyA: prevBody,
                            localAnchorA: planck.Vec2(0, 0),
                            bodyB: body,
                            localAnchorB: planck.Vec2(0, 0),
                            length: (prevBody.data.radius + radius) * 1.3 }));

                    }

                    bodyList.push(body);
                    this._startingDirection = -this._startingDirection;
                } else {
                    this._spawnCountdown += 0.1; // do another check soon
                }
            }

            // process each moving body
            bodyList.forEach(function (body, index) {
                body.data.sizeCountdown -= dt;

                if (body.data.sizeCountdown < 0) {
                    body.data.sizeCountdown += 0.1 + Math.random() * 0.3;

                    var nextRadius = body.data.radius + (1.5 - body.data.radius) * Math.random() * 0.05;
                    var nextFixture = body.createFixture(planck.Circle(nextRadius), _this._ballFD);

                    body.destroyFixture(body.data.fixture);

                    body.data.fixture = nextFixture;
                    body.data.radius = nextRadius;

                    if (index > 0) {
                        var _prevBody = bodyList[index - 1];
                        body.data.prevJoint.setLength((_prevBody.data.radius + nextRadius) * 1.3);
                    }

                    if (index < bodyList.length - 1) {
                        var nextBody = bodyList[index + 1];
                        body.data.nextJoint.setLength((nextBody.data.radius + nextRadius) * 1.3);
                    }
                }
            });

            // eliminate furthest offscreen bubble in the chain
            if (bodyList.length > 0) {
                var lastBody = bodyList[0];
                var position = lastBody.getPosition();

                if (position.x > 30) {
                    world.destroyBody(lastBody);
                    bodyList.splice(0, 1);
                }
            }
        } }]);return BannerWorld;}();


var canvas = document.createElement('canvas');
canvas.style.position = 'absolute';
canvas.style.top = '0vh';
canvas.style.left = '0vw';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
document.body.appendChild(canvas);

var bufferWidth = canvas.offsetWidth;
var bufferHeight = canvas.offsetHeight;
var aspectRatio = bufferWidth / bufferHeight;
canvas.width = bufferWidth;
canvas.height = bufferHeight;

var ctx = canvas.getContext('2d');

var main = new BannerWorld();

// pre-simulate to get some length going
// @todo spread out over a few frames
Array.apply(null, new Array(800)).forEach(function () {
    var dt = 1 / 60.0;
    main._world.step(dt);
    main.step(dt);
});

var pointXTmp = [];
var pointYTmp = [];
var pointITmp = [];

function renderer() {
    var dt = 1 / 60.0;
    main._world.step(dt);
    main.step(dt);

    pointXTmp.length = 0;
    pointYTmp.length = 0;
    pointITmp.length = 0;

    var segmentTravel = 0.4;
    var segmentCount = 150;
    var segmentIndex = 0;

    var direction = -main._startingDirection; // first body gets the proper winding direction
    var bx = 0,by = 0,br = 0;
    var azimuth = 0;
    var travelLeft = 0;
    var nextBodyIndex = main._bodyList.length - 1;

    while (nextBodyIndex >= 0) {
        // determine arc and line segment towards next body
        var nextBody = main._bodyList[nextBodyIndex];
        var nextPos = nextBody.getPosition();
        var nextRadius = nextBody.data.radius - 0.15;

        var dx = nextPos.x - bx;
        var dy = nextPos.y - by;
        var nextBodyDirection = Math.atan2(dy, dx);

        var distance = Math.sqrt(dx * dx + dy * dy);
        var projectedDistance = Math.min(distance, br + nextRadius);
        var alongDistance = Math.sqrt(distance * distance - projectedDistance * projectedDistance);

        var alphaSine = projectedDistance / distance;
        var arcEndAzimuth = nextBodyDirection - direction * (Math.PI / 2 - Math.asin(alphaSine));

        // ensure end of arc is always "ahead" of the starting azimuth
        var arcAzimuthDelta = arcEndAzimuth - azimuth;
        var extraRotations = -Math.floor(direction * arcAzimuthDelta / (Math.PI * 2));
        var arcLength = direction * (arcAzimuthDelta + direction * extraRotations * Math.PI * 2) * br;

        var travelUntilStraightPortion = travelLeft + arcLength;
        var arcSegmentCount = Math.floor(travelUntilStraightPortion / segmentTravel);
        var displayedArcSegmentCount = Math.min(arcSegmentCount, segmentCount - segmentIndex);

        // step through arc segments, drawing line to end of each one (hence 1-based loop)
        for (var i = 1; i <= displayedArcSegmentCount; i += 1) {
            var segmentAzimuth = azimuth + direction * (i * segmentTravel - travelLeft) / br;
            pointXTmp.push(bx + Math.cos(segmentAzimuth) * br);
            pointYTmp.push(by + Math.sin(segmentAzimuth) * br);
            pointITmp.push(pointITmp.length);
        }

        segmentIndex += displayedArcSegmentCount;

        // step through the linear portion
        var travelLeftInArc = travelUntilStraightPortion - arcSegmentCount * segmentTravel;
        var travelUntilNextArc = travelLeftInArc + alongDistance;
        var straightSegmentCount = Math.floor(travelUntilNextArc / segmentTravel);
        var displayedStraightSegmentCount = Math.min(straightSegmentCount, segmentCount - segmentIndex);
        var endCos = Math.cos(arcEndAzimuth);
        var endSin = Math.sin(arcEndAzimuth);

        // draw to first segment point on the line
        if (displayedStraightSegmentCount > 0) {
            var firstSegmentLinearTravel = direction * (segmentTravel - travelLeftInArc);
            pointXTmp.push(bx + endCos * br - endSin * firstSegmentLinearTravel);
            pointYTmp.push(by + endSin * br + endCos * firstSegmentLinearTravel);
            pointITmp.push(pointITmp.length);
        }

        // draw to last segment point on the line
        if (displayedStraightSegmentCount > 1) {
            var lastSegmentLinearTravel = direction * (segmentTravel * displayedStraightSegmentCount - travelLeftInArc);
            pointXTmp.push(bx + endCos * br - endSin * lastSegmentLinearTravel);
            pointYTmp.push(by + endSin * br + endCos * lastSegmentLinearTravel);
            pointITmp.push(pointITmp.length);
        }

        segmentIndex += displayedStraightSegmentCount;

        bx = nextPos.x;
        by = nextPos.y;
        br = nextRadius;
        azimuth = arcEndAzimuth + Math.PI; // next arc starts at opposite side of circle
        travelLeft = travelUntilNextArc - straightSegmentCount * segmentTravel;
        direction = -direction;
        nextBodyIndex -= 1;
    }

    pointITmp.sort(function (a, b) {return pointYTmp[b] - pointYTmp[a];});

    ctx.fillStyle = '#6FA8BF';
    ctx.fillRect(0, 0, bufferWidth, bufferHeight);

    var pigmentColor = onecolor('#D94A4A');

    ctx.save();

    ctx.translate(bufferWidth / 2, bufferHeight / 2);
    ctx.scale(bufferHeight / 15, -bufferHeight / 15);
    ctx.translate(-8, 1);

    ctx.lineWidth = 0.2;
    ctx.miterLimit = 2;
    ctx.strokeStyle = '#F2EAE4';

    // bottom outline behind the main fill
    ctx.beginPath();

    ctx.moveTo(0, -2);

    for (var _i = 0; _i < pointXTmp.length; _i += 1) {
        var x = pointXTmp[_i];
        var y = pointYTmp[_i] * 0.5;
        ctx.lineTo(x, y - 2);
    }

    ctx.stroke();

    // main fill, sorted by depth
    for (var _i2 = 0; _i2 < pointITmp.length; _i2 += 1) {
        var index = pointITmp[_i2];
        var lx = index === 0 ? 0 : pointXTmp[index - 1];
        var ly = (index === 0 ? 0 : pointYTmp[index - 1]) * 0.5;
        var _x = pointXTmp[index];
        var _y = pointYTmp[index] * 0.5;

        var _dx = _x - lx;
        var _dy = _y - ly;

        var bias = 0.01 * Math.sign(_dx); // pixel bias to avoid visual gaps due to anti-alias

        ctx.fillStyle = _dx < 0 ? '#3E3F59' : pigmentColor.lightness(-(1 - _dx * _dx / (_dx * _dx + _dy * _dy)) * 0.4, true).css();
        ctx.beginPath();

        ctx.moveTo(lx - bias, ly);
        ctx.lineTo(_x + bias, _y);
        ctx.lineTo(_x + bias, _y - 2);
        ctx.lineTo(lx - bias, ly - 2);

        ctx.fill();
    }

    // top outline above fill
    ctx.lineWidth = 0.1;
    ctx.beginPath();

    ctx.moveTo(0, -2);
    ctx.lineTo(0, 0);

    for (var _i3 = 0; _i3 < pointXTmp.length; _i3 += 1) {
        var _x2 = pointXTmp[_i3];
        var _y2 = pointYTmp[_i3] * 0.5;
        ctx.lineTo(_x2, _y2);
    }

    ctx.stroke();

    // main._bodyList.forEach(body => {
    //     const pos = body.getPosition();
    //     ctx.fillStyle = '#0f0';
    //     ctx.fillRect(pos.x - 0.05, pos.y - 0.05, 0.1, 0.1);
    // });

    ctx.restore();

    window.requestAnimationFrame(renderer);
}

renderer();

// planck.testbed('Banner', function (testbed) {
//     testbed.step = function (dtms) {
//         const dt = dtms / 1000;

//         main.step(dt);
//     };

//     testbed.x = 0;
//     testbed.y = 0;
//     testbed.info('Banner animation');

//     return main._world;
// });