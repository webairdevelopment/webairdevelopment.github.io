// WIP
// COLOR BUG

const c = document.querySelector('canvas');
        // creating c as a 'brush'
        let ctx = c.getContext('2d');
      /*  var image = new Image();
        
        image.onload = function() {
            console.log('Loaded image');
            // do somethingElse()
            ctx.drawImage(image, 0, 0, c.width, c.height);
           // works like CSS, apply styles before 
        }
        
        image.src = 'giphyHalloween.gif'; 
        // make canvas full screen
        c.width = window.innerWidth;
        c.height = window.innerHeight;
        ctx.fillStyle = 'blue'
        ctx.strokeStyle = 'red'
        ctx.font = '36pt Helvetica'
        ctx.textAlign = 'center'
        // x y width height
        ctx.fillRect(100, 100, 100, 100);
        ctx.strokeRect(50, 50, 50, 50);
        // beginPath for making a new shape
        ctx.beginPath();
        // moves drawing to the location, no drawing yet
        ctx.moveTo(125, 125);
        // draws it on this location
        ctx.lineTo(175, 175);
        // move it again etc / drawing
        ctx.lineTo(175, 125);
        // fill it in etc
        ctx.fill();
        ctx.stroke();
        // 50 10 position
        ctx.strokeText("hello", 150, 100)
        
        multiplies the x and y value by a given factor
        scale(x, y)
        ctx.scale(2, 3)
        movest all subsequent draw commands ny x hor, y vert
        translate(x,y)
        rotates an object a certain number of radians (from center)
        ctx.rotate()
        radians = degrees * (Math.PI/180)
        restore a state with
        ctx.restore()
        ctx.fillRect()
        */
        // make canvas full screen
        c.width = window.innerWidth;
        c.height = window.innerHeight;
    /*    for (let i = 0; i < 200; i++) {
        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight;
        let num = Math.random() * 3
        // so you dont rotate the whole canvas
        ctx.save();
        ctx.translate(x,y);
        ctx.rotate(num);
        ctx.fillStyle = 'silver';
        ctx.fillRect(x, y, 10, 10);
        ctx.restore();
        }
        // lines
        for (let i = 0; i < 20; i++) {
        let x = Math.random() * 2;
        let y = Math.random() * 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'white'
        ctx.stroke()
        }
        // arc
        // x y radius start angle end angle math * pi * 2 circle
        // seperate the prevoous drawing with
        
        
        // crreate multiple with for loops
        for (let i = 0; i < 200; i++) {
            // randomize x and y
            let x = Math.random() * window.innerWidth;
            let y = Math.random() * window.innerHeight;
            ctx.beginPath();
            // change x and y for each i
            ctx.arc(x, y, 4, 0, Math.PI * 2, false)
            // outline
            ctx.strokeStyle = 'white'
            ctx.stroke()
        }
        
         let x = Math.random() * innerWidth
         let y = Math.random() * innerHeight
         // get random num neg or pos
         let dx = (Math.random() - 0.5) * 8
         let dy = (Math.random() - 0.5) * 8
         let radius = 4
        */
        // creat object
        let initColor = 'white'
        let colors = [
            '#ffffff',
            '#C30021',
            '#50C339'
        ]
        let mouse = {
            x: undefined,
            y: undefined
        }
        window.addEventListener('mousemove', function(event) {
            mouse.x = event.x;
            mouse.y = event.y;
        })
        
        function Circle(x, y, dx, dy, radius, color) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.radius = radius;
            this.colors = colors[Math.floor(Math.random() * colors.length)]
            // create method
            this.draw = function(color) {
              //  this.color = color
                ctx.beginPath();
                // change x and y for each i
                ctx.moveTo(this.x, this.y)
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
                // outline
                ctx.fillStyle = this.colors
                ctx.fill();
            }
            
            this.update = function() {
             if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
                    this.dx = -this.dx
                } 
            if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
                    this.dy = -this.dy
                } 
                // make more random
               
            // send snow to spawn again
               
            // velocity
            this.x += this.dx;
            this.y += this.dy;
              // interactivy
            if (mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
                // 20 max radius
                if (this.radius < 20) {
                    this.radius += 1;
                    this.draw(this.colors)
                }
                
                // if radius is not greater than 2, or if mouse is not over x y, shrink circles
            } else if (this.radius > 2){
                this.radius -= 1; 
                this.draw()
            }
               
                 // call the draw
            this.draw()
            }
        
           
        }
        
        
        // instantiate new
         // create array for all elements
         let group = []
         let group2 = []
         
         for (let i = 0; i < 800; i++) {
            let radius = Math.random() * 4 + 1
            let x = Math.random() * (innerWidth - radius * 2) + radius;
            let y = Math.random() * (innerHeight - radius * 2) + radius;
            // get random num neg or pos
            let dx = (Math.random() - 0.5) * 4
            let dy = (Math.random() - 0.5) * 4
            let color = initColor
            
            group.push(new Circle(x, y, dx, dy, radius, color))
        
        }
        
       /* for (let i = 0; i < 200; i++) {
            let radius = 4
            let x = Math.random() * (innerWidth - radius * 2) + radius;
            let y = Math.random() * (innerHeight - radius * 2) + radius;
            // get random num neg or pos
            let dx = (Math.random() - 0.5) * 8
            let dy = (Math.random() - 0.5) * 8
            let color = 'white'
            
            group2.push(new Circle(x, 0, dx, dy, radius, color))
        } */
        
        
        function animate() {
            
            // this increments
            requestAnimationFrame(animate);
            
            // clear canvas so no overlap when canvas refesh
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            // animate something
             for (let i = 0; i < group.length; i++) {
                 // 
                 group[i].update();
             //    group2[i].update();
             }
            
         
         /*   ctx.beginPath();
            // change x and y for each i
            ctx.arc(x, y, radius, 0, Math.PI * 2, false)
            // outline
            ctx.strokeStyle = 'white'
            ctx.stroke();
            // reverse velocities in conditional
            // if x plus radius is greater than, bounce back
            // if x minus radius is less that, bounce back etc
            */
            
        }
        
        animate();