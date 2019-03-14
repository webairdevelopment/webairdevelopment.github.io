
var gc = new GameCanvas();
var perlin = new Perlin();
gc.ctx.imageSmoothingEnabled = false;

var gravity = 0.2;

var textures = [];
generateTextures();

var world = new World(400, 60, 50, 50);
generateWorld();
var player = new Player(world);
var enemies = [];
var signText = ["(LMB) Shoot magic\n(A, D) Move\n(Space) Jump", "Welcome to your adventure, Wizard.\nYou may be carefull!\nThere's enemies lurking\nin the dark", "The boss is near"];
var signs = [];
var particleEmitters = [];
var boss = new Boss(world, 10.2 * world.blockWidth, 30 * world.blockHeight);

var cameraShaker = new CameraShaker();

var isMobile = 'ontouchstart' in window;
var mobileController = new MobileController();

var hasStarted = false;
var startCounter = 0;
var startState = 0;

function loop() {
  rect(0, 0, width, height, "black");
  
  if (hasStarted) {
    world.render();

    for (var i = 0; i < enemies.length; i++) {
      enemies[i].update();
      enemies[i].render();
    }

    boss.render();
    boss.update();

    for (var i = 0; i < signs.length; i++) {
      signs[i].update();
      signs[i].render();
    }

    for (var i = 0; i < particleEmitters.length; i++) {
      particleEmitters[i].update();
      particleEmitters[i].render();
    }

    player.update();
    player.render();

    if (isMobile) {
      mobileController.update();
      mobileController.render();
    }
  }
  else {
    rect(0, 0, width, height, "black");
    if (startState % 2 == 0)
      text("START", width / 2, height / 2 + width / 20, width / 10, "white", {fontFamily: "Pixel", alignText: "center"});
    
    if (mouse.left || touch.touches.length > 0)
      hasStarted = true;
    
    startCounter++;
    if (startCounter % 35 == 0)
      startState++;
  }
}

function generateWorld() {
  var mapURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAAoCAYAAADQUaxgAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMS41ZEdYUgAAA/5JREFUeF7t3AtO5DAQRVE0s99ZDmtiV4wrTUFRvHzccRI73CcdaeiO7XzkKlC35qXkHdd5e3v74fX1FQC6V2qYLmy4Ds0EwAhKvdJFDH2gkQDoValRunChLzQRAL0ptUkXLBznr3htiyuaiP8FFKnjAPw+pS7pYoU+nVnAba25c6CRACj14GeBQN+OLuA+v1o7qj0HnzdTxwLoX6kDujigf60LsM+n1pqztr7PuTTv2hwA+lT2r97UGIcXaPWAFT8+U3NvoeZy6njFjlXnCqBfZe/qDY15z34IfrS1Ilxb1N1Z10sTAcZS9q3ezPiylnxsy59rzRXhZxrHFWgiwDjKntUbGY9iblE3LrKo8VdQBfjM5vH+7+Hxc/19oYEA4yh7Vm/kvUrpEK9tSxzzJ/z7TBZ1w+ZY1DxXiEX41OaxEjVGscR7C6BPZb/qTTxHNYbH6+tRJ6AsRa3dkked1xKLmu8q1jhU86j5PCNGvZ9Z1L1xFjUus6jxAPpS9qvexG5r1ORHiFHnW0NFrbmFRa1xlbkGspWl9tos8Z5kFjUus6jxAPqy2iHUoF54YvFRv2HPRc35LEte92rPNJDpM4ySZ67NEscpljhm7nmpsQD68qJeHM1a1Jgj+AfIreTCWqumgcT8uK4SNcZN51uSxykWNUdkUWMB9OUWDaQXraOKa43aBqKuyazNszQ286h5nEWNBdAXGkinLKq41mjRQLY0D8vc2EzNkc3NB6AvmxqIKgSZGvcbHHEPfD5VXKvMfGNOidcRqWMzO05dgzo2ssy9nucD0J/ZBvJMETFqrjuJ98Woe7BXnHOXigayV6troHkA4/jWQFoUABsb57yLvfflEic2kFZoIMA4PhtIy+J4hybiDcOp6+zeYA2E5gGMZWogRxRImzMv5mJhztTxZ8jnoa5pOA0aSIuvE29R81VgAH04rIEYmzcvuLaWF/At8txL1PhIncvIctQx2VrUGKX2v3/3qOcGoF+nNpDW63jx30KNv7NckD2f73/8xh8Tj88scf694vpqPQD9O7SBGJv76DXw3VJRjlHvL7Go9Wp51BoAxjHtZrXJW6GBnMeTH3IrFrXuEv8MJUbNDWA8NJAb8OSHewSLOgclRs0FYGynNBCahzZ9DvDxG7p6T70eedSDPZJFnU9kUWMB3Me001UBaIkG8lXsW0Y90LN4pmsLjdCjxgC4l1MayN3M/eWwFHXz7yBHHQPgnn59A/FmoBrC9H5F1A0GgLuavsZrUcVzJEuNYE/yDQMAPHTdQOaaQm3yRQMA9ru8gZSV08/ryRcBADjf6Q1kS/JJAgD6MzUQY1EFv4WYuDgAYFyfDcQclbgGAOAevjUQAAC2eX3/DzVY3jp7nvDFAAAAAElFTkSuQmCC";
  
  var c = document.createElement("canvas");
  c.width = 400;
  c.height = 40;
  var ctx = c.getContext("2d");
  var img = new Image();
  img.src = mapURL;
  img.onload = function() {
    ctx.drawImage(img, 0, 0);
    var pixels = ctx.getImageData(0, 0, c.width, c.height).data;

    var x = 0;
    var y = 0;
    var signIndex = 0;
    for (var i = 0; i < pixels.length; i += 4) {
      var r = pixels[i + 0];
      var g = pixels[i + 1];
      var b = pixels[i + 2];

      if (r == 255 && g == 255 && b == 255)
        world.changeBlock(x, y, 1);
      else if (r == 255 && g == 255 && b == 0) {
        signs.push(new Sign(world, x * world.blockWidth, y * world.blockHeight - world.blockHeight * 0.5, world.blockWidth * 1.5, world.blockHeight * 1.5, signText[signIndex]));
        signIndex++;
      }
      else if (r != 0 && g == 0 && b == 0) {
        enemies.push(new Enemy(world, (x - r) * world.blockWidth, (y - 1) * world.blockHeight, (x + r) * world.blockWidth, (y - 1) * world.blockHeight));
      }
      else if (r == 255 && g == 110 && b == 0)
        world.changeBlock(x, y, 2);
      else if (r == 150 && g == 150 && b == 150)
        world.changeBlock(x, y, 3);
      else if (r == 200 && g == 200 && b == 200)
        world.changeBlock(x, y, 4);
      else if (r == 0 && g == 0 && b == 255) {
        world.changeBlock(x, y, 6);
        particleEmitters.push(new ParticleEmitter((x + 0.5) * world.blockWidth, (y + 0.5) * world.blockHeight));
      }
      else if (r == 0 && g == 255 && b == 0)
        world.changeBlock(x, y, 1)

      x++;
      if (x >= 400) {
        x = 0;
        y++;
      }
    }
  }
}

function generateTextures() {
  this.rectangles = [[{x: 1, y: 1, width: 9, height: 1},
                      {x: 2, y: 2, width: 9, height: 1},
                      {x: 3, y: 3, width: 6, height: 1},
                      {x: 11, y: 3, width: 1, height: 4},
                      {x: 4, y: 4, width: 3, height: 1},
                      {x: 4, y: 5, width: 2, height: 1},
                      {x: 5, y: 6, width: 1, height: 4},
                      {x: 7, y: 5, width: 1, height: 1},
                      {x: 9, y: 5, width: 1, height: 1},
                      {x: 6, y: 8, width: 4, height: 1},
                      {x: 10, y: 7, width: 1, height: 4},
                      {x: 3, y: 9, width: 2, height: 4},
                      {x: 11, y: 9, width: 2, height: 4},
                      {x: 4, y: 14, width: 2, height: 2},
                      {x: 10, y: 14, width: 2, height: 2},
                      {x: 6, y: 14, width: 4, height: 1},
                      {x: 10, y: 12, width: 1, height: 2},
                      {x: 7, y: 9, width: 1, height: 1},
                      {x: 9, y: 9, width: 1, height: 1},
                      {x: 6, y: 10, width: 1, height: 1},
                      {x: 8, y: 10, width: 1, height: 1},
                      {x: 5, y: 11, width: 1, height: 1},
                      {x: 7, y: 11, width: 1, height: 1},
                      {x: 9, y: 11, width: 1, height: 1},
                      {x: 6, y: 12, width: 1, height: 1},
                      {x: 8, y: 12, width: 1, height: 1}, 
                      {x: 5, y: 13, width: 1, height: 1},
                      {x: 7, y: 13, width: 1, height: 1},
                      {x: 9, y: 13, width: 1, height: 1}]];
  
  var scale = 16;
  
  for (var i = 0; i < rectangles.length; i++) {
    var t = rectangles[i];
    
    var c = document.createElement("canvas");
    c.width = 16 * scale;
    c.height = 16 * scale;
    var ctx = c.getContext("2d");
    ctx.fillStyle = "white";
    
    for (var j = 0; j < t.length; j++) {
      var r = t[j];
      ctx.beginPath();
      ctx.fillRect(r.x * scale, r.y * scale, r.width * scale, r.height * scale);
    }
    
    textures.push(c.toDataURL());
  }
  
  textures[1] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAABoSURBVDhPvY9BDsAgDMP4/6c7qIpEqCmcZsnSEtLDmpmRBO0alRVpvxcvyI2E7on1TW4kdF+QGwndin3rUnlD9hLCirRPRUjQ7v9fGMheQnhivsleQkjQzqWSoJ1L5WT/RqkcVHnR2gehjmTGdazPsAAAAABJRU5ErkJggg=="; //Enemy
  
  textures[2] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAABySURBVDhPzY5RCsAgDEN7/0s7EbO9xvZj7GeBYH1JxRgf9aMHImKZEqNdxwNV2e/U5P0CGcW8/IGLGTt7zpAS6zqL3QMKnF2ezTkv6nzhDCTnygp+gORmaXlnucS5sgSWC7KVWjb9XJpCaXTPsDIW4BgXfehQzBBXbRcAAAAASUVORK5CYII="; //Ground
  
  textures[3] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAABySURBVDhPpZFBDsAgCAT9/6cpIGKRFU2cZBLZslzaiOhJFA5OmboGK7vM/Q+TpnmF9/zBds5lwXv+YDvPB+6AB8QbQicM7A2hEwazIu2ngK1I+ykwEWhvc2D9lX2GwlAdR4qyCENVikP03YSheygTUfsAt35E5rA1DGMAAAAASUVORK5CYII="; //Heart
  
  textures[4] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAABoSURBVDhPrZABCoAwDMT2/09XW7hxK5ngNBDsUpDpiIhPajhleYFmb0lvy+yHDvXe8AaJZmrJfHo8YfsPxFNL8AZvzv99wk5BuxKjKWhXYjQF7UqMpqBdidEUtCsxmoJ2JUZT0O42xgVRCVvP3xoUBgAAAABJRU5ErkJggg=="; //Sign
  
  textures[5] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAACTSURBVDhPjZABDsAgCAP3gP3/u8wW6wCJ2yUXoDJjdpnZSdGd0TYMiu6MtuEUqIJ6TttwClRBPadtOATeX7dmEHfoFkxB/DjW5BYMgfd+gTKhjKZhCrzfXwC0R9MwBN0cK1g7q5mCd+7/gSpdzRDEOWaxCu5oMS65+QfWCnhel17PzxeHC5zPGoPsvxeksAo+qtkD22IzWAtCfyAAAAAASUVORK5CYII="; //Spike
  
  textures[6] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAABySURBVDhPnZIBDoAwCAP5/wP2XbRmIwzK3NbkolwTJU5RVWmtfdcbqPyjvxBJD0CiW/m7DTxUgt3vQuUJfkD8XIHY7AsjrI/4eYLKE6h8QZg3xpapAOwEqlMZN8hU7EJlACldLADCPCWJ1R/IuiTOUHkAYT79AR/+A9QAAAAASUVORK5CYII=";//"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAABgSURBVDhPnY+BCoAwCAX3/z9tXJSovYXu4EBPiLXMDOGdR8rYEO55eyiC6scvcGV8BNWTMk6MC8R9J/geD1FQ80cZJ8rYFFq/8Nf8A5AOXWUswrbVw1gVQXWE1NIy19YFPiEOHZGMWpcAAAAASUVORK5CYII="; //Dirt
  
  textures[7] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAB0SURBVDhPxY/REoBQBET7/48mKsVymXrpzJhw7dImMAYRpV4T7wTFbChKs2HBmSjTJf79zjvRZHhFbKxEzYWpsQwzCEbojPg3vECR7yPCAas9OCPR/7dRbVckrwVKJUrLjq7DD2DtwwgG0zCaK8HgC38bMO9kFlB4UMm7DwAAAABJRU5ErkJggg==" //Ground upside down
  
  textures[8] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAHvSURBVFhHxZMxTkQxDEQjREtHQUNHyTWQOAYlBRU3gOMsp0B0XGr5zvc4Y2f+sjSf4inxxJ7xX2nbsR3+FSnuiRT3RIp/4un7KPUzkWLlvt2uIWvYYCt80WPmF6QILtvFMKnhGcwcP9vbutjWcgUpGhb+0V6r0QhFyPqeiCV8Jn1IQYqgG7khma7wAgKfXb1MI19GihiOUGZrAaG7jyFzjEm4azcYGKYLZgbqW0ctku9TliFFZ4TBHFSt1LEo1f0uciYhhs2UjVET6MNMr2t/rtt1u+onSOHP7WEMOHKZCt5rH9ee8dIe427ExaC/3RgspK9Fn/emN8wsb96bskAqlCkbnVVjttbjnjJTMS1wLrQAfgGw0bu9AIaqCU5F9Jk54B7UJdxIRZj44GTKwFzhPViMfFOekYreWI38Xt/CVIRxL98XUp6RCjSHiS+AOvRhuEKLTLrfyS9lpsL/o3MYB1Q8gPti1t+LX8pMBfDGEcKmZFjf+4wz9bi2nCkrFQwMkokHudHAAza1PJdyUgFKcxh0UwYBC+md9LZE+H3KMaRYCDNabASVwKleUb4dKYIU6Citfjl60OenzJAiU81Owb3UL32BFBk3ijsZJ/BGPZOXQooKZVpDQe07hRS3YPMa+tXe/xxuSHFPpLgfh/YDUZGiiqA2+W4AAAAASUVORK5CYII="; //Goal
  
  textures[9] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAB5SURBVDhPrZJRDoAgDEO5/6UnI24+B1VJfAlZaTu+aGa2OoqpW42v5I5aps9DhleDuIe3mqEd+YDzNp3xQOBaldW8REeWTuhnxhID+mTKWdxZzg7LDOg71c+cRVVazdD3S4clNUM72/8gdPDfV14VnsgdLvMoSs/aAfxXg6d3ZiMOAAAAAElFTkSuQmCC"; //Barrel
  
  textures[10] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAABeSURBVDhPpYwBCsAwDAL3/09ndDRFMxOQCkeXc/hExBVSOkjpIKWDlA5SOkjpIKWDlAMr5OgYwFBHx2YF39HlQXK/mNqf7zywrEFX+zPQpevS/wbcsW8gg2P158ZHvBXIOfFwXeSXAAAAAElFTkSuQmCC"; //Broken barrel
}

function MobileController() {
  this.pad1 = {x: 0, y: 0, jx: 0, jy: 0, key: true};
  this.pad2 = {x: 0, y: 0, jx: 0, jy: 0, key: true};
  this.x = 0;
  this.y = 0;
  this.lastMouse = true;
  
  this.render = function() {
    circle(this.pad1.x, this.pad1.y, 50, "rgba(255, 255, 255, 0.5)");
    circle(this.pad1.jx, this.pad1.jy, 20, "rgba(255, 255, 255, 0.5)");
    circle(this.pad2.x, this.pad2.y, 50, "rgba(255, 255, 255, 0.5)");
    circle(this.pad2.jx, this.pad2.jy, 20, "rgba(255, 255, 255, 0.5)");
  }
  
  this.update = function() {
    for (var i = 0; i < touch.touches.length; i++) {
      var t = touch.touches[i];
      if (t.x < width / 2) {
        this.pad1.jx = t.x;
        this.pad1.jy = t.y;
        
        if (this.pad1.key) {
          this.pad1.x = t.x;
          this.pad1.y = t.y;
          this.pad1.key = false;
        }
      }
      else {
        this.pad2.jx = t.x;
        this.pad2.jy = t.y;
        
        if (this.pad2.key) {
          this.pad2.x = t.x;
          this.pad2.y = t.y;
          this.pad2.key = false;
        }
      }
    }
    
    this.a1 = getAngle(this.pad1.x, this.pad1.y, this.pad1.jx, this.pad1.jy);
    this.pad1.jx = this.pad1.x + Math.cos(this.a1) * 50;
    this.pad1.jy = this.pad1.y + Math.sin(this.a1) * 50;
    this.a2 = getAngle(this.pad2.x, this.pad2.y, this.pad2.jx, this.pad2.jy);
    this.pad2.jx = this.pad2.x + Math.cos(this.a2) * 50;
    this.pad2.jy = this.pad2.y + Math.sin(this.a2) * 50;
    
    if (touch.touches.length == 0) {
      this.pad1.key = true;
      this.pad2.key = true;
    }
  }
}

function CameraShaker() {
  var _this = this;
  this.counter = 0;
  this.a = 0;
  this.cancelCounter = 0;
  
  this.shake = function(duration) {
    il();
    function il() {
      world.camera.x = world.realCamera.x + Math.cos(_this.a) * Math.sin(_this.counter) * 7;
      world.camera.y = world.realCamera.y + Math.sin(_this.a) * Math.sin(_this.counter) * 7;
      _this.counter += Math.PI / 7;
      if (_this.counter > Math.PI - 0.01 && _this.counter < Math.PI + 0.01) {
        _this.counter = 0;
        _this.a = Math.random() * Math.PI * 2;
        _this.cancelCounter++;
      }
      if (_this.cancelCounter <= duration)
        requestAnimationFrame(il);
      else {
        _this.counter = 0;
        _this.cancelCounter = 0;
      }
    }
  }
}

function ParticleEmitter(x, y) {
  var _this = this;
  this.x = x;
  this.y = y;
  this.particles = [];
  
  this.render = function() {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].render();
    }
  }
  
  this.update = function() {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
    }
    var a = Math.random() * Math.PI * 2;
    var l = Math.random();
    this.particles.push(new Particle(this.x + Math.cos(a) * l * world.blockWidth, this.y + Math.sin(a) * l * world.blockHeight));
  }
  
  function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.health = 50;
    
    this.render = function() {
      rect(this.x - world.camera.x, this.y - world.camera.y, 10, 10, "rgb(255, 30, 173)");
    }
    
    this.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx += Math.random() * 0.5 - 0.25;
      this.vy -= 0.1;
      this.health--;
      if (this.health <= 0) {
        _this.particles.splice(_this.particles.indexOf(this), 1);
      }
    }
  }
}

function Sign(world, x, y, width, height, txt) {
  var _this = this;
  this.world = world;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.text = txt;
  this.rows = [];
  this.currentIndex = 0;
  this.currentRow = 0;
  this.isClose = false;
  this.addCharInterval;
  this.intervalKey = true;
  
  this.render = function() {
    image(textures[4], this.x - this.world.camera.x, this.y - this.world.camera.y, this.width, this.height);
    if (this.isClose) {
      for (var i = 0; i < this.rows.length; i++)
        text(this.rows[i], this.x + this.width / 2 - this.world.camera.x, this.y - this.rows.length * 30 - this.world.camera.y + i * 30, 30, "rgb(255, 30, 173)", {alignText: "center", fontFamily: "Pixel"});
    }
  }
  
  this.update = function() {
    if (getDistance(this.x, this.y, player.x, player.y) < this.width * 2)
      this.isClose = true;
    else
      this.isClose = false;
    
    if (this.isClose && this.intervalKey) {
      this.intervalKey = false;
      this.addCharInterval = setInterval(function() {
        if (_this.currentIndex < _this.text.length) {
          if (_this.text[_this.currentIndex] == "\n") {
            _this.currentRow++;
          }
          else {
            _this.rows[_this.currentRow] = _this.rows[_this.currentRow] || "";
            _this.rows[_this.currentRow] += _this.text[_this.currentIndex];
          }
          _this.currentIndex++;
        }
        else {
          clearInterval(_this.addCharInterval);
        }
      }, 50);
    }
    else if (!this.isClose){
      _this.rows = [];
      _this.currentRow = 0;
      _this.currentIndex = 0;
      this.intervalKey = true;
    }
  }
}

function Boss(world, x, y) {
  var _this = this;
  this.world = world;
  this.x = x;
  this.y = y;
  this.vx = 0;
  this.vy = 0;
  this.width = 8 * this.world.blockWidth;
  this.height = 8 * this.world.blockHeight;
  this.hitbox = {x: -50, y: 0, width: 250, height: 400};
  this.texture = textures[1];
  this.stage = 0;
  this.lastStage = -1;
  this.health = 500;
  this.isJumping = false;
  this.dir = 1;
  this.intervals = [];
  this.shakeJump = false;
  this.deadState = 0;
  this.deadCounter = 0;
  this.deadRotation = 0;
  this.disappear = false;
  
  this.barrels = [];
  this.spikes = [];
  
  this.storedBlocks = [];
  
  this.takeDamage = function() {
    this.health--;
  }
  
  this.render = function() {
    if ((this.deadState % 2 == 0 || this.health > 0) && !this.disappear) {
      gc.ctx.save();
      gc.ctx.translate(this.x - this.world.camera.x + this.width / 2, this.y - this.world.camera.y + this.height / 2);
      gc.ctx.scale(this.dir, 1);
      if (this.deadRotation != 0)
        gc.ctx.translate(0, this.height / 3);
      gc.ctx.rotate(this.deadRotation);
      image(this.texture, -this.width / 2, -this.height / 2, this.width, this.height);
      gc.ctx.restore();
    }
    
    for (var i = 0; i < this.barrels.length; i++) {
      this.barrels[i].render();
    }
    
    for (var i = 0; i < this.spikes.length; i++) {
      this.spikes[i].render();
    }
  }
  
  this.update = function() {
    if (!this.disappear) {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += gravity * 0.5;

      if (player.x > this.x + this.width / 2 - this.hitbox.width / 2 + this.hitbox.x && player.x < this.x + this.width / 2 + this.hitbox.width / 2 + this.hitbox.x &&
          player.y > this.y + this.height / 2 - this.hitbox.height / 2 + this.hitbox.y && player.y < this.y + this.height / 2 + this.hitbox.height / 2 + this.hitbox.y) {
        var a = (this.x + this.width / 2) - player.x < 0;
        player.vx = Math.cos(Math.PI * (a ? 1.9 : 1.1)) * 10;
        player.vy = Math.sin(Math.PI * (a ? 1.9 : 1.1)) * 10;
        player.freeze = true;
      }

      for (var x = 0; x < this.world.world.length; x++) {
        for (var y = 0; y < this.world.world[x].length; y++) {
          var b = this.world.world[x][y];
          if (this.x + this.width >= b.x && this.x < b.x + b.width &&
              this.y + this.height >= b.y && this.y < b.y + b.height &&
              this.world.blockData[b.id].collision) {
            switch (b.closestSide(this.x + this.width / 2, this.y + this.height / 2)) {
              case 0:
                this.y = b.y - this.height;
                this.vy = 0;
                this.vx *= 0.5;
                this.touchingGround = true;

                if (this.shakeJump) {
                  cameraShaker.shake(6);
                  this.shakeJump = false;
                }

                break;
              case 1:
                this.x = b.x + b.width;
                this.vx = 0;
                break;
              case 2:
                this.y = b.y + b.height + 1;
                if (this.vy < 0) this.vy = 0;
                break;
              case 3:
                this.x = b.x - this.width;
                this.vx = 0;
                break;
            }
          }
        }
      }

      switch (this.stage) {
        case 0:
          if (getDistance(this.x, this.y, player.x, player.y) < 600) {
            this.stage = 1;
          }
          break;
        case 1:
          if (this.stage != this.lastStage) {
            _this.changeDoorState(true);
            this.shakeJump = true;
            player.freeze = true;
            player.unFreezeOnLanding = false;

            setTimeout(function() {
              _this.vy = -6;
              _this.shakeJump = true;
            }, 500);

            setTimeout(function() {
              player.freeze = false;
              player.unFreezeOnLanding = true;
            }, 3000)

            setTimeout(function() {
              _this.stage = 2;
            }, 5000);
            this.lastStage = this.stage;
          }
        case 2:
          if (this.stage != this.lastStage) {
            this.stage3Setup();
            this.lastStage = this.stage;
          }
          if (this.health <= 250) {
            this.stage = 3;
            clearInterval(this.intervals[0]);
            clearInterval(this.intervals[1]);
          }
          break;
        case 3:
          if (this.stage != this.lastStage) {
            this.stage4Setup();
            this.lastStage = this.stage;
          }
          if (this.health <= 0)  {
            this.stage = 4;
            clearInterval(this.intervals[2]);
          }
        case 4:
          if (this.stage != this.lastStage) {
            this.unlockNextPart();
            this.changeDoorState(false);
            this.lastStage = this.stage;
          }
          break;
      }

      for (var i = 0; i < this.barrels.length; i++) {
        this.barrels[i].update();
      }

      for (var i = 0; i < this.spikes.length; i++) {
        this.spikes[i].update();
      }

      if (this.health <= 0) {
        this.deadCounter++;
        if (this.deadState >= 10) {
          this.deadRotation = Math.PI * 1.5;
          this.deadState = 0;
          window.setTimeout(function() {
            _this.disappear = true;
          }, 3000);
        }
        else if (this.deadCounter % 20 == 0)
          this.deadState++;
      }
    }
  }
  
  this.stage3Setup = function() {
    this.intervals[0] = setInterval(function() {
      _this.vy = -12;
      _this.dir *= -1;
      _this.shakeJump = true;

      setTimeout(function() {
        for (var i = 0; i < 15; i++) {
          var x = Math.floor((_this.x + _this.width / 2) / _this.world.blockWidth) + i * -_this.dir;
          var y = Math.floor((_this.y + _this.height) / _this.world.blockHeight) - 1;
          var b = _this.world.world[x][y];
          _this.storedBlocks[i] = {x: x, y: y, id: b.id};
          setTimeout(function(a) {
            a.id = 5;
          }, i * 40, b);
        }

        setTimeout(function() {
          for (var i = 0; i < _this.storedBlocks.length; i++) {
            var s = _this.storedBlocks[i];
            setTimeout(function(a, b) {
              a.id = b;
            }, i * 40, _this.world.world[s.x][s.y], s.id);
          }
        }, 4000);
      }, 3000);
    }, 7000);

    this.intervals[1] = setInterval(function() {
      if (_this.vy == 0)
        _this.barrels.push(new Barrel(_this.x + _this.width / 2, _this.y + _this.height, _this.dir));
    }, 1500);
  }
  
  this.stage4Setup = function() {
    this.intervals[2] = setInterval(function() {
      _this.spikes.push(new Spike(Math.random() * 1200 - 600 + _this.x, _this.y - 500));
    }, 500);
  }
  
  this.changeDoorState = function(state) {
    for (var i = 0; i < 7; i++) {
      this.world.changeBlock(25, 30 + i, state ? 4 : 0);
    }
  }
  
  this.unlockNextPart = function() {
    for (var i = 0; i < 5; i++) {
      this.world.changeBlock(119, 19 + i, 0)
    }
  }
  
  function Spike(x, y) {
    this.x = x;
    this.y = y;
    this.width = _this.world.blockWidth;
    this.height = _this.world.blockHeight;
    this.vy = 0;
    this.health = 200;
    this.texture = textures[5];
    
    this.render = function() {
      gc.ctx.save();
      gc.ctx.translate(this.x - _this.world.camera.x + this.width / 2, this.y - _this.world.camera.y + this.height / 2);
      gc.ctx.scale(1, -1);
      image(this.texture, -this.width / 2, -this.height / 2, this.width, this.height);
      gc.ctx.restore();
    }
    
    this.update = function() {
      this.y += this.vy;
      this.vy += gravity * 0.5;
      
      if (getDistance(this.x + this.width / 2, this.y + this.height / 2, player.x + player.height / 2, player.y + player.height / 2) < this.width * 0.9) {
        this.health = 0;
        player.takeDamage();
      }
      
      this.health--;
      if (this.health <= 0)
        _this.spikes.splice(_this.spikes.indexOf(this), 1);
    }
  }
  
  function Barrel(x, y, dir) {
    this.width = _this.world.blockWidth * 1.5;
    this.height = _this.world.blockHeight * 1.5;
    this.x = x;
    this.y = y - this.height;
    this.dir = dir;
    this.health = 200;
    this.texture = textures[9];
    this.brokenTexture = textures[10];
    this.canDamagePlayer = true;
    
    this.render = function() {
      image(this.texture, this.x - _this.world.camera.x, this.y - _this.world.camera.y, this.width, this.height);
    }
    
    this.update = function() {
      this.x += this.dir * 3;
      
      if (this.canDamagePlayer && getDistance(this.x, this.y, player.x, player.y + player.height / 2) < this.width * 0.9) {
        this.canDamagePlayer = false;
        player.takeDamage();
        player.freeze = true;
        player.unFreezeOnLanding = false;
        setTimeout(function() {
          player.freeze = false;
          player.unFreezeOnLanding = true;
        }, 500);
        cameraShaker.shake(3);
        this.dir = 0;
        this.texture = this.brokenTexture;
      }
      
      this.health--;
      if (this.health <= 0)
        _this.barrels.splice(_this.barrels.indexOf(this), 1);
    }
  }
}

function Enemy(world, x, y, moveToX, moveToY) {
  var _this = this;
  this.world = world;
  this.x = x;
  this.y = y;
  this.width = this.world.blockWidth * 2;
  this.height = this.world.blockHeight * 2;;
  this.startX = x;
  this.startY = y;
  this.moveX = moveToX;
  this.moveY = moveToY;
  this.dir = 1;
  this.speed = 2;
  this.fireRange = 400;
  this.detectRange = 600;
  this.angry = false;
  this.bullets = [];
  this.fireCounter = 0;
  this.health = 5;
  
  this.render = function() {
    gc.ctx.save();
    gc.ctx.translate(this.x - this.world.camera.x + this.width / 2, this.y - this.world.camera.y + this.height / 2);
    gc.ctx.scale(this.dir, 1);
    image(textures[1], -this.width / 2, -this.height / 2, this.width, this.height);
    gc.ctx.restore();
    
    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].render();
    }
  }
  
  this.update = function() {
    if (!this.angry) {
      var a = getAngle(this.startX, this.startY, this.moveX, this.moveY);
      this.x += Math.cos(a) * this.speed;
      this.y += Math.sin(a) * this.speed;
      if (getDistance(this.x, this.y, this.moveX, this.moveY) < this.speed) {
        var t = this.startX;
        this.startX = this.moveX;
        this.moveX = t;
        var t = this.startY;
        this.startY = this.moveY;
        this.moveY = t;
        this.dir *= -1;
      }
    }
    
    if (getDistance(this.x, this.y, player.x + player.width / 2, player.y + player.height / 2) < this.fireRange) {
      this.angry = true;
      this.dir = (player.x - this.x) > 0 ? 1 : -1;
      
      if (this.fireCounter % 50 == 0) {
        var a = getAngle(this.x + this.width / 2, this.y + this.height / 2, player.x + player.width / 2, player.y + player.height / 2);
        this.bullets.push(new Bullet(this.x + this.width / 2, this.y + this.height / 2, Math.cos(a) * 6, Math.sin(a) * 6));
      }
      
      this.fireCounter++;
    }
    else {
      this.angry = false;
    }
    
    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].update();
    }
  }
  
  this.takeDamage = function() {
    this.health--;
    if (this.health <= 0) {
      enemies.splice(enemies.indexOf(this), 1);
    }
  }
  
  function Bullet(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.health = 100;
    
    this.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      
      loop1:
      for (var i = Math.max(0, Math.round(_this.world.camera.x / _this.world.blockWidth) - 1); i < width / _this.world.blockWidth + Math.round(_this.world.camera.x / _this.world.blockWidth) + 1; i++) {
        for (var j = 0; j < _this.world.worldHeight; j++) {
          var b = _this.world.world[i][j];
          if (this.x > b.x && this.x < b.x + b.width &&
              this.y > b.y && this.y < b.y + b.height &&
              _this.world.blockData[b.id].collision) {
            this.health = 0;
            break loop1;
          }
        }
      }
      
      if (this.x > player.x && this.x < player.x + player.width &&
          this.y > player.y && this.y < player.y + player.height) {
        this.health = 0;
        player.takeDamage();
      }
      
      this.health--;
      if (this.health <= 0) {
        _this.bullets.splice(_this.bullets.indexOf(this), 1);
      }
    }
    
    this.render = function() {
      rect(this.x - _this.world.camera.x, this.y - _this.world.camera.y, 15, 15, "white");
    }
  }
}

function Player(world) {
  var _this = this;
  this.world = world;
  this.x = 0;
  this.y = 400;
  this.width = this.world.blockWidth * 2;
  this.height = this.world.blockHeight * 2;
  this.vx = Math.cos(Math.PI * 2) * 5;
  this.vy = Math.sin(Math.PI * 2) * 5;
  this.bullets = [];
  this.fireKey = true;
  this.health = 5;
  this.touchingGround = false;
  this.dir = 1;
  this.freeze = true;
  this.unFreezeOnLanding = true;
  this.gameOver = false;
  this.gameOverScreenFade = -1;
  this.win = false;
  this.winScreenFade = -1;
  this.canTakeDamage = true;
  this.damagedState = 0;
  this.damagedCounter = 0;
  
  this.takeDamage = function() {
    if (!this.gameOver && !this.win && this.canTakeDamage)
      this.health--;
  }
  
  this.render = function() {
    if (this.canTakeDamage || (!this.canTakeDamage && this.damagedState % 2 == 0)) {
      gc.ctx.save();
      gc.ctx.translate(this.x - this.world.camera.x + this.width / 2, this.y - this.world.camera.y + this.height / 2);
      gc.ctx.scale(this.dir, 1);
      image(textures[0], -this.width / 2, -this.height / 2, this.width, this.height);
      gc.ctx.restore();
    }
    
    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].render();
    }
    
    for (var i = 0; i < this.health; i++) {
      image(textures[3], 10 + i * 64, 10, 64, 64);
    }
    
    if (this.gameOver) {
      rect(0, 0, width, height, "rgba(0, 0, 0, " + this.gameOverScreenFade + ")");
      text("Game Over", width / 2, height / 2, width / 10, "rgba(255, 255, 255, " + this.gameOverScreenFade + ")", {fontFamily: "Pixel", alignText: "center"});
      text("Try again", width / 2, height / 2 + width / 10, width / 20, "rgba(255, 255, 255, " + (this.gameOverScreenFade - 2) + ")", {fontFamily: "Pixel", alignText: "center"});
      this.gameOverScreenFade += 0.02;
      
      if ((mouse.left || touch.touching) && this.gameOverScreenFade >= 3) {
        window.location.reload();
      }
    }
    
    if (this.win) {
      rect(0, 0, width, height, "rgba(255, 255, 255, " + this.winScreenFade + ")");
      text("YOU WIN!", width / 2, height / 3, width / 10, "rgba(0, 0, 0, " + this.winScreenFade + ")", {fontFamily: "Pixel", alignText: "center"});
      text("Thank you for playing my game", width / 2, height / 3 + width / 10, width / 40, "rgba(0, 0, 0, " + (this.winScreenFade - 2) + ")", {fontFamily: "Pixel", alignText: "center"});
      text("This game was made for the Codepen challange:", width / 2, height / 3 + width / 10 + width / 40, width / 40, "rgba(0, 0, 0, " + (this.winScreenFade - 2)  + ")", {fontFamily: "Pixel", alignText: "center"});
      text("Color pop January 2019", width / 2, height / 3 + width / 10 + width / 40 * 2, width / 40, "rgba(0, 0, 0, " + (this.winScreenFade - 2)  + ")", {fontFamily: "Pixel", alignText: "center"});
      text("@TC5550_2 on twitter", width / 2, height - width / 15, width / 40, "rgba(0, 0, 0, " + (this.winScreenFade - 3)  + ")", {fontFamily: "Pixel", alignText: "center"});
      text("https://aaserver.net", width / 2, height - width / 40, width / 40, "rgba(0, 0, 0, " + (this.winScreenFade - 3)  + ")", {fontFamily: "Pixel", alignText: "center"});
      this.winScreenFade += 0.02;
    }
  }
  
  this.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += gravity;
    
    if (!this.freeze) {
      if (getKey(32) && this.touchingGround) {
        this.vy = -7;
        this.y -= 1;
        this.touchingGround = false;
      }

      if (getKey("a")) {
        this.x -= 5;
        this.dir = -1;
      }
      if (getKey("d")) {
        this.x += 5;
        this.dir = 1;
      }
    }
    
    if (isMobile && touch.touches.length > 0) {
      this.x += Math.cos(mobileController.a1) * 5;
      this.dir = Math.cos(mobileController.a1) > 0 ? 1 : -1;
      
      if (Math.sin(mobileController.a1) < -0.5 && this.touchingGround) {
        this.vy = -7;
        this.y -= 1;
        this.touchingGround = false;
      }
    }
    
    this.x = Math.max(0, this.x);
    
    this.world.setCamera(this.x - width * 0.4, this.y - height / 2);
    
    for (var x = 0; x < this.world.world.length; x++) {
      for (var y = 0; y < this.world.world[x].length; y++) {
        var b = this.world.world[x][y];
        if (this.x + this.width >= b.x && this.x < b.x + b.width &&
            this.y + this.height >= b.y && this.y < b.y + b.height) {
          if (this.world.blockData[b.id].damage) {
            if (this.canTakeDamage) {
              this.takeDamage();
              this.canTakeDamage = false;
              window.setTimeout(function() {
                _this.canTakeDamage = true;
              }, 2000);
            }
          }
          if (b.id == 6) {
            this.win = true;
            this.freeze = true;
            this.unFreezeOnLanding = false;
          }
          else if (this.world.blockData[b.id].collision) {
            switch (b.closestSide(this.x + this.width / 2, this.y + this.height / 2)) {
              case 0:
                this.y = b.y - this.height;
                this.vy = 0;
                this.vx *= 0.5;
                this.touchingGround = true;
                if (this.unFreezeOnLanding)
                  this.freeze = false;
                break;
              case 1:
                this.x = b.x + b.width;
                this.vx = 0;
                break;
              case 2:
                this.y = b.y + b.height + 1;
                if (this.vy < 0) this.vy = 0;
                break;
              case 3:
                this.x = b.x - this.width;
                this.vx = 0;
                break;
            }
          }
        }
      }
    }
    
    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].update();
    }
    
    var isTouching = false;
    for (var i = 0; i < touch.touches.length; i++) {
      if (touch.touches[i].x > width / 2) {
        isTouching = true;
        break;
      }
    }
    
    if (isMobile && isTouching && !this.freeze) {
      this.bullets.push(new Bullet(this.x + this.width / 2, this.y + this.height / 2, Math.cos(mobileController.a2) * 15, Math.sin(mobileController.a2) * 15))
    }
    
    if (mouse.left && this.fireKey && !this.freeze) {
      var a = getAngle(this.x + this.width / 2, this.y + this.height / 2, mouse.x + this.world.camera.x, mouse.y + this.world.camera.y);
      this.bullets.push(new Bullet(this.x + this.width / 2, this.y + this.height / 2, Math.cos(a) * 15, Math.sin(a) * 15));
      this.fireKey = false;
    }
    else if (!mouse.left)
      this.fireKey = true;
    
    if (this.health <= 0) {
      this.freeze = true;
      this.unFreezeOnLanding = false;
      this.gameOver = true;
    }
    
    if (!this.canTakeDamage)
      this.damagedCounter++;
    else {
      this.damagedCounter = 0;
      this.damagedState = 0;
    }
    
    if (this.damagedCounter % 10 == 0)
      this.damagedState++;
  }
  
  function Bullet(x, y, vx, vy) {
    var _bulletThis = this;
    this.particles = [];
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.health = 100;
    
    this.render = function() {
      for (var i = 0; i < this.particles.length; i++) {
        this.particles[i].render();
      }
    }
    
    this.update = function() {
      for (var i = 0; i < this.particles.length; i++) {
        this.particles[i].update();
      }
      
      this.particles.push(new Particle(this.x, this.y));
      this.x += this.vx;
      this.y += this.vy;
      this.particles.push(new Particle(this.x - this.vx / 2, this.y - this.vy / 2));
      
      for (var i = 0; i < enemies.length; i++) {
        var e = enemies[i];
        if (this.x > e.x && this.x < e.x + e.width &&
            this.y > e.y && this.y < e.y + e.height) {
          e.takeDamage();
          this.health = 0;
          break;
        }
      }
      
      if (this.x > boss.x + boss.width / 2 - boss.hitbox.width / 2 + boss.hitbox.x && this.x < boss.x + boss.width / 2 + boss.hitbox.width / 2 + boss.hitbox.x && 
          this.y > boss.y + boss.height / 2 - boss.hitbox.height / 2 + boss.hitbox.y && this.y < boss.y + boss.height / 2 + boss.hitbox.height / 2 + boss.hitbox.y) {
        boss.takeDamage();
        this.health = 0;
      }
      
      loop1:
      for (var i = Math.max(0, Math.round(_this.world.camera.x / _this.world.blockWidth) - 1); i < width / _this.world.blockWidth + Math.round(_this.world.camera.x / _this.world.blockWidth) + 1; i++) {
        for (var j = 0; j < _this.world.worldHeight; j++) {
          var b = _this.world.world[i][j];
          if (this.x > b.x && this.x < b.x + b.width &&
              this.y > b.y && this.y < b.y + b.height &&
              _this.world.blockData[b.id].collision) {
            this.health = 0;
            break loop1;
          }
        }
      }
      
      this.health--;
      if (this.health <= 0) {
        _this.bullets.splice(_this.bullets.indexOf(this), 1);
      }
    }
    
    function Particle(x, y) {
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.health = 20;
      this.rgb = [255, 30, 173];
      
      this.render = function() {
        rect(roundTo(this.x, 7) - _this.world.camera.x, roundTo(this.y, 7) - _this.world.camera.y, 7, 7, "rgba(" + this.rgb[0] + "," + this.rgb[1] + "," + this.rgb[2] + "," + this.health / 20 + ")");
      }
      
      function roundTo(x, to) {
        return Math.round(x / to) * to;
      }
      
      this.update = function() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx += Math.random() - 0.5;
        this.vy += Math.random() - 0.5;
        this.health--;
        if (this.health <= 0) {
          _bulletThis.particles.splice(_bulletThis.particles.indexOf(this), 1);
        }
      }
    }
  }
}

function World(ww, wh, bw, bh) {
  var _this = this;
  
  this.blockData = [{id: 0, color: "black", collision: false, texture: "", damage: false},
                    {id: 1, color: "white", collision: true, texture: textures[2], damage: false},
                    {id: 2, color: "white", collision: true, texture: textures[5], damage: true},
                    {id: 3, color: "white", collision: true, texture: textures[6], damage: false},
                    {id: 4, color: "white", collision: true, texture: textures[7], damage: false},
                    {id: 5, color: "white", collision: false, texture: textures[5], damage: true},
                    {id: 6, color: "purple", collision: false, texture: textures[8], damage: false}];
  
  this.camera = {x: 0, y: 0};
  this.realCamera = {x: 0, y: 0};
  
  this.worldWidth = ww;
  this.worldHeight = wh;
  this.blockWidth = bw;
  this.blockHeight = bh;
  this.world = new Array(this.worldWidth);
  for (var i = 0; i < this.world.length; i++) {
    this.world[i] = new Array(this.worldHeight);
    for (var j = 0; j < this.world[i].length; j++) {
      this.world[i][j] = new Block(i * this.blockWidth, j * this.blockHeight, 0);
    }
  }
  
  this.render = function() {
    for (var i = Math.max(0, Math.round(this.camera.x / this.blockWidth) - 1); i < width / this.blockWidth + Math.round(this.camera.x / this.blockWidth) + 1; i++) {
      for (var j = 0; j < this.worldHeight; j++) {
        var b = this.world[i][j];
        b.render();
      }
    }
  }
  
  this.setCamera = function(x, y) {
    this.camera = {x: Math.max(0, x), y: Math.max(0, y)};
    this.realCamera = {x: Math.max(0, x), y: Math.max(0, y)};
  }
  
  this.changeBlock = function(x, y, id) {
    this.world[x][y].id = id;
  }
         
  function Block(x, y, id) {
    this.x = x;
    this.y = y;
    this.width = _this.blockWidth;
    this.height = _this.blockHeight;
    this.id = id;
    
    this.sides = [{x: this.x + this.width / 2, y: this.y},
                  {x: this.x + this.width, y: this.y + this.height / 2},
                  {x: this.x + this.width / 2, y: this.y + this.height},
                  {x: this.x, y: this.y + this.height / 2}];
    
    this.render = function() {
      if (!_this.blockData[this.id].texture)
        rect(Math.floor(this.x - _this.camera.x), Math.floor(this.y - _this.camera.y), this.width, this.height, _this.blockData[this.id].color);
      else
        image(_this.blockData[this.id].texture, Math.floor(this.x - _this.camera.x), Math.floor(this.y - _this.camera.y), this.width, this.height);
    }
    
    this.closestSide = function(x, y) {
      var closestDist = Infinity;
      var closestI = -1;
      for (var i = 0; i < this.sides.length; i++) {
        var s = this.sides[i];
        var d = getDistance(x, y, s.x, s.y);
        if (d < closestDist) {
          closestDist = d;
          closestI = i;
        }
      }
      return closestI;
    }
  }
}