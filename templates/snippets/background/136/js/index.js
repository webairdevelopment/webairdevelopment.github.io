
     //////////////////////////////////
      //       CONFIG
      //////////////////////////////////
      var config = {
        num_rows: 8,
        num_cols: 10,
        vx: 57,
        vy: 3,
      }
      //////////////////////////////////
      //       UTILITY FUNCTIONS
      //////////////////////////////////
      var util = {

        // fill entire canvas with a preset color
        fill: function (rgb, amt) {
          ctx.beginPath(); // start path
          ctx.rect(- canvas.width / 2, - canvas.height / 2, canvas.width, canvas.height) // set rectangle to be the same size as the window
          ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${amt})` // use the rgb array/color for fill, and amt for opacity
          ctx.fill() // do the drawing
        },
        // draw a circle
        drawCircle: function (x, y, r, color) {
          ctx.beginPath()
          ctx.arc(x, y, r, 0, 2 * Math.PI)
          ctx.fillStyle = color || 'white'
          ctx.fill()
          ctx.closePath()
        },
        /**
        * @param {Array} points x and y coordinates [[x, y], [x, y], etc...]
        * @param {Boolean} close close the path, or leave open?
        */
        path: function (points, close) {
          // flatten to array
          var pts = [].concat.apply([], points);
          // move to 1st point
          ctx.moveTo(pts[0], pts[1])
          for (let i = 2; i < pts.length; i+=2) {
            // draw line to every point
            ctx.lineTo(pts[i], pts[i+1]);
          }

          if (close === true) {
            // and then close the path
            ctx.lineTo(pts[0], pts[1]);
          }
        },
        bezier(points, offset_x, offset_y, scale_x, scale_y) {
          // flatten to array
          var pts = [].concat.apply([],points);
          ctx.moveTo(
            pts[0] * scale_x + offset_x,
            pts[1] * scale_y + offset_y
          );
          ctx.bezierCurveTo(
            pts[2] * scale_x + offset_x,
            pts[3] * scale_y + offset_y,
            pts[4] * scale_x + offset_x,
            pts[5] * scale_y + offset_y,
            pts[6] * scale_x + offset_x,
            pts[7] * scale_y + offset_y
          );
        },
        quad(points, offset_x, offset_y, scale_x, scale_y) {
          // flatten to array
          var pts = [].concat.apply([],points);
          ctx.moveTo(
            pts[0] * scale_x + offset_x,
            pts[1] * scale_y + offset_y
          );
          ctx.quadraticCurveTo(
            pts[2] * scale_x + offset_x,
            pts[3] * scale_y + offset_y,
            pts[4] * scale_x + offset_x,
            pts[5] * scale_y + offset_y
          );
        },
        /**
        * @param {Number} x x coordinate
        * @param {Number} y y coordinate
        * @param {Number} w width
        * @param {Number} h height
        */
        rect (x, y, w, h) {
          // move to 1st point
          ctx.moveTo(x, y)
          ctx.lineTo(x + w, y);
          ctx.lineTo(x + w, y + h);
          ctx.lineTo(x, y + h);
          ctx.lineTo(x, y);
        },
        /**
         * @param {Number} h hue [0..360]
         * @param {Number} s saturation [1..0]
         * @param {Number} l lightness [0..1]
         * @param {Number} a alpha [0..1]
         */
        hsla(h, s, l, a) {
          return 'hsla(' + h + ',' + s * 100 + '%,' + l * 100 + '%,' + a + ')';
        },
        rgba(r, g, b, a) {
          return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        },
        // initialize with a seed
        randomSeed(seed) {
          this._seed = seed % 2147483647;
          if (this._seed <= 0) this._seed += 2147483646;
        },
        /**
         * Returns a pseudo-random value between 1 and 2^32 - 2.
         */
        randomNext() {
          if (this._seed === undefined) {
            this.randomSeed(1);
          }
          return this._seed = this._seed * 16807 % 2147483647;
        },
        /**
         * Returns a pseudo-random floating point number in range [0, 1).
         */
        random(min, max) {
          if (min === undefined) min = 0;
          if (max === undefined) max = 1;
          return (this.randomNext() - 1) / 2147483646 * (max - min) + min;
        }
      };

      //////////////////////////////////
      //       INITIALIZE
      //////////////////////////////////

      // create a canvas element
      var canvas = document.createElement("canvas")

      // get the canvas context (this is the part we draw to)
      var ctx = canvas.getContext("2d")

      // attach element to DOM, this way I don't need to rely on the canvas already being there
      document.getElementsByTagName("body")[0].appendChild(canvas)

      // background color [r, g, b] 
      // I define color this way because it's easy to convert to a rgba color using the array spread operator
      var bg = [255, 255, 255]

      // setup a default size using height, this will be updated soon.
      // wh is used to store the width or the height, whichever is smaller
      // this way the content can shrink to fit
      var wh = window.innerHeight;

      // define setup function
      // this function runs initially, and every time the window resizes
      function setup() {
        // update the canvas size to match the window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // update size to get minimum of windo width or height
        wh = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
        wh -= 40; // add some padding

        // set the 0,0 point to the middle of the canvas, this is not necessary but it can be handy
        ctx.translate(canvas.width / 2, canvas.height / 2);

        util.fill(bg, 1);
      }

      // run initial setup
      setup();

      // re-setup canvas when the size of the window changes 
      window.addEventListener("resize", setup)
      var frameAnimId;

      // initialize a set of rows
      var elements = [];
      for (var col = 0; col < config.num_cols; col++) {
        for (var row = 0; row < config.num_rows; row++) {
          elements.push(new Thingy( row, col ))
          if(row > 0) {
            elements.push(new Thingy( row, col + 0.5 ))
          }
        }
      }

      var l = 0;
      var lMax = 140;

      function draw() {
        l = (l + 1) % lMax;

        // this is a draw loop, this will execute regularily and is comparable to EnterFrame on other platform
        frameAnimId = window.requestAnimationFrame(function () { draw() })
        util.fill(bg, 1);
        // update all the elements
        for (var i = 0; i < elements.length; i++) {
          elements[i].draw() // do it once per element
        }

      }

      // start enterFrame loop
      window.requestAnimationFrame(draw);

      //////////////////////////////////
      //           ELEMENTS
      //////////////////////////////////
      
      /**
       * row and col are floats between 0 and 1
       */
      function Thingy(row, col) {
        this.row = row;
        this.col = col;
        this.rowNorm = row / config.num_rows;
        this.colNorm = col / config.num_cols;
        this.x = this.colNorm * wh - wh / 2;
        this.y = this.rowNorm * wh - wh / 2;
        this.w = wh / config.num_cols;
        this.h = wh / config.num_rows;
        this.s = [];
        this.maxS = 20;
        
        if (this.col % 2 === 0.5) {
          this.path = [
            [this.x - this.w * 0.5, this.y - this.h / 2],
            [this.x + this.w * 0.5, this.y],
            [this.x - this.w * 0.5, this.y + this.h / 2]
          ]
          this.c = [0, 0]
          this.path.forEach(p => {this.c[0] += p[0] / this.path.length});
          this.path.forEach(p => {this.c[1] += p[1] / this.path.length});
        }
        else if (this.col % 2 === 1.5) {
          this.path = [
            [this.x + this.w * 0.5, this.y - this.h / 2],
            [this.x - this.w * 0.5, this.y ],
            [this.x + this.w * 0.5, this.y + this.h / 2]
          ]
          this.c = [0, 0]
          this.path.forEach(p => {this.c[0] += p[0] / this.path.length});
          this.path.forEach(p => {this.c[1] += p[1] / this.path.length});
        }
        else if (this.col % 2 === 1) {
          this.path = [
            [this.x, this.y],
            [this.x + this.w , this.y + this.h/2],
            [this.x, this.y + this.h]
          ]
          this.c = [0, 0]
          this.path.forEach(p => {this.c[0] += p[0] / this.path.length});
          this.path.forEach(p => {this.c[1] += p[1] / this.path.length});
        }
        else {
          this.path = [
            [this.x + this.w, this.y],
            [this.x , this.y + this.h/2],
            [this.x + this.w, this.y + this.h]
          ]
          this.c = [0, 0]
          this.path.forEach(p => {this.c[0] += p[0] / this.path.length});
          this.path.forEach(p => {this.c[1] += p[1] / this.path.length});
        }
        
        this.draw = function () {
          // DRAW
          var n = (Math.sin((this.rowNorm * 0.3 + l / lMax) * Math.PI * 2) + 1) * 0.48;
          // n = Math.pow(2, -(Math.tan(n * 0.29)) * 2.82) * 0.97;
          var pts = this.path.map(pt => {
            return [
              pt[0] * n + (this.c[0]) * (1 - n),
              pt[1] * n + (this.c[1]) * (1 - n),
            ]
          })

          ctx.beginPath();
          ctx.fillStyle = util.hsla(0, 0, 0, 1);
          util.path(pts, true);
          ctx.fill();
        }
      }