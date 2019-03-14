            const Butterfly = {
                canvas : null,
                ctx : null,
                WIDTH : 0,
                HEIGHT : 0,
                Matrix : mat4.create(),
                scale : vec3.create([0.12,0.12,0.12]),
                Segments : [],
                Boids : [],
                BNumber : 80,                
                setup(){
                  this.WIDTH = window.innerWidth ;
                  this.HEIGHT = window.innerHeight;
                  this.canvas = document.getElementById("canvas");
                  this.canvas.width = this.WIDTH;
                  this.canvas.height = this.HEIGHT;
                  this.ctx = canvas.getContext("2d");
                  window.addEventListener("resize", () => this.resize(), false);
                  window.addEventListener("mousemove", (event) => this.move(event), false);
                  
                  for(let i=0;i<this.BNumber;i++){
                    let s = new Butterfly.Segment(i);
                    this.Segments.push(s);
                    let b = new Butterfly.Boid();
                    this.Boids.push(b);
                    b.position.x = Math.random() * 4 - 2;
                    b.position.y = Math.random() * 4 - 2;
                    b.position.z = Math.random() * 4 - 2;
                    b.velocity.x = Math.random() * 6 - 3;
                    b.velocity.y = Math.random() * 6 - 3;
                    b.velocity.z = Math.random() * 6 - 3;
                    b.setAvoidWalls( true );
                    b.setWorldSize( this.WIDTH, this.HEIGHT, 2000 );
                  }
                  Butterfly.onEnterFrame();
                },
                resize(){
                  this.WIDTH = window.innerWidth ;
                  this.HEIGHT = window.innerHeight;
                  this.canvas.width = this.WIDTH;
                  this.canvas.height = this.HEIGHT;
                  this.Boids.forEach((b)=>{
                      b.setWorldSize( this.WIDTH, this.HEIGHT, 2000 );
                  })
                },
                move(event){
                    let vector = new Butterfly.Vector3( event.clientX - (this.WIDTH/2), - event.clientY + (this.HEIGHT/2), 0 );
                    this.Boids.forEach((b)=>{
                        vector.z = b.position.z;
                        b.repulse( vector );
                    })
                }
            }
            
            Butterfly.Segment = class{
                constructor(i){
                    this.leftWing = [
                       vec3.create([-28,0,0])  , vec3.create([-110,0,72]) , vec3.create([-154,0,128]) , vec3.create([-143,0,156]) , vec3.create([-81,0,122]) , vec3.create([-10,0,95]) , 
                       vec3.create([-15,0,63]) , vec3.create([37,0,85])   , vec3.create([54,0,85])    , vec3.create([66,0,74])    , vec3.create([81,0,75])   , vec3.create([86,0,63]) , 
                       vec3.create([99,0,57])  , vec3.create([102,0,47])  , vec3.create([149,0,42])   , vec3.create([111,0,39])   , vec3.create([111,0,29])  , vec3.create([113,0,23])  ,
                       vec3.create([90,0,22])  , vec3.create([63,0,10])   , vec3.create([23,0,0]) 
                    ];
                    this.rigthWing = [
                       vec3.create([-28,0,0])   , vec3.create([-110,0,-72]) , vec3.create([-154,0,-128]) , vec3.create([-143,0,-156]) , vec3.create([-81,0,-122]) , vec3.create([-10,0,-95]) , 
                       vec3.create([-15,0,-63]) , vec3.create([37,0,-85])   , vec3.create([54,0,-85])    , vec3.create([66,0,-74])    , vec3.create([81,0,-75])   , vec3.create([86,0,-63]) , 
                       vec3.create([99,0,-57])  , vec3.create([102,0,-47])  , vec3.create([149,0,-42])   , vec3.create([111,0,-39])   , vec3.create([111,0,-29])  , vec3.create([113,0,-23]) , 
                       vec3.create([90,0,-22])  , vec3.create([63,0,-10])   , vec3.create([23,0,0]) 
                    ];
                    this.index = i;
                    this.wing_L = [];
                    this.wing_R = [];
                    this.leftWing.forEach(()=>{
                       this.wing_L.push(vec3.create([0,0,0]));
                       this.wing_R.push(vec3.create([0,0,0]));
                    })
                    this.leftMatrix = mat4.create();
                    this.rigthMatrix = mat4.create();
                    this.timer = new Date().getTime();
                    this.wingAngelCounter = 0;
                    this.spped = 10;                    
                    this.position = vec3.create([0,0,0]);
                    this.rotation = vec3.create([0,0,0]);
                }
                setMatrix(){
                    let now = new Date().getTime();
                    mat4.identity(this.leftMatrix);
                    mat4.identity(this.rigthMatrix);
                    mat4.multiply(this.leftMatrix,Butterfly.Matrix);
                    mat4.multiply(this.rigthMatrix,Butterfly.Matrix);
                    mat4.translate(this.leftMatrix,this.position);
                    mat4.translate(this.rigthMatrix,this.position);
                    mat4.scale(this.leftMatrix,Butterfly.scale);
                    mat4.scale(this.rigthMatrix,Butterfly.scale);
                    let r = this.rotation;
                    if(r[0] !== 0) mat4.rotateX(this.leftMatrix,r[0]);
                    if(r[1] !== 0) mat4.rotateY(this.leftMatrix,r[1]);
                    if(r[2] !== 0) mat4.rotateZ(this.leftMatrix,r[2]);
                    if(r[0] !== 0) mat4.rotateX(this.rigthMatrix,r[0]);
                    if(r[1] !== 0) mat4.rotateY(this.rigthMatrix,r[1]);
                    if(r[2] !== 0) mat4.rotateZ(this.rigthMatrix,r[2]);
                   
                    let a = 80 * Math.PI/180 * Math.sin(this.wingAngelCounter);
                    if(now - this.timer > this.spped){
                        this.wingAngelCounter += 0.1;
                        this.timer = now;
                    }
                    mat4.rotateX(this.leftMatrix,a);
                    mat4.rotateX(this.rigthMatrix,-a);
                }
                setVretex(){
                    this.setMatrix();
                    let left_Z = Infinity , rigth_Z = Infinity;  
                    this.leftWing.forEach((v,i)=>{
                        vec3.set(v,this.wing_L[i]);
                        mat4.multiplyVec3(this.leftMatrix,this.wing_L[i]);
                        if(this.wing_L[i][2] < left_Z) left_Z = this.wing_L[i][2];
                    })
                    this.rigthWing.forEach((v,i)=>{
                        vec3.set(v,this.wing_R[i]);
                        mat4.multiplyVec3(this.rigthMatrix,this.wing_R[i]);
                        if(this.wing_R[i][2] < rigth_Z) rigth_Z = this.wing_R[i][2];
                    })
                    return {left:left_Z , rigth:rigth_Z};
                }
                get_Z(){
                    let z = this. setVretex();
                    return Math.max(z.left,z.rigth);
                }
                draw(){
                    let z = this. setVretex();
                    if(z.left > z.rigth){
                        this.cavasDraw(this.wing_L);
                        this.cavasDraw(this.wing_R);
                    }else{
                        this.cavasDraw(this.wing_R);
                        this.cavasDraw(this.wing_L);
                    }
                }
                cavasDraw(v){
                    let ctx = Butterfly.ctx;
                    ctx.fillStyle = 'rgba(200,80,180,0.8)';
                    ctx.strokeStyle = 'graly';
                    ctx.beginPath();
                    ctx.lineWidth = 1;                    
                    v.forEach((vec,i)=>{
                        let sp = Butterfly.getScrrenPoint(vec);
                        if(i==0)ctx.moveTo(sp.x,sp.y);
                        else ctx.lineTo(sp.x,sp.y);             
                    })
                    ctx.closePath();
                    ctx.stroke();
                    ctx.fill();
                }
            }
            
            Butterfly.getScrrenPoint = (v) =>{
                let x = v[0] , y = v[1] , z = v[2];
                let fl = 800;
                let scale_z = fl + z;
                let scale = fl / scale_z;
                let xx = x * scale;
                let yy = y * scale;
                return {x:xx , y:yy , scale:scale};
            }

            Butterfly.onEnterFrame = () =>{
                requestAnimationFrame(Butterfly.onEnterFrame);
                Butterfly.ctx.setTransform(1,0,0,1,0,0);
                Butterfly.ctx.clearRect(0,0,Butterfly.WIDTH,Butterfly.HEIGHT);
                Butterfly.ctx.transform(1,0,0,-1,Butterfly.WIDTH/2,Butterfly.HEIGHT/2);                
                mat4.identity(Butterfly.Matrix);
//                mat4.rotateY(Butterfly.Matrix,a*Math.PI/180);
                let array = [];
                Butterfly.Segments.forEach((s)=>{
                    array.push({z:s.get_Z() , object:s});
                })
                array.sort(function(a,b){
	if( a.z < b.z ) return -1;
	if( a.z > b.z ) return 1;
                    return 0;
                });
                array.forEach((s,i)=>{
                    let seg = s.object;
                    let boid = Butterfly.Boids[i];
                    boid.run( Butterfly.Boids );
                    seg.position[0] = boid.position.x;
                    seg.position[1] = boid.position.y;
                    seg.position[2] = boid.position.z;
                    let vct = seg.position[0] < seg.position[0] ? -1 : 1;
                    seg.rotation[0] = Math.atan2( - boid.velocity.z, boid.velocity.x ) * vct;
                    seg.rotation[2] = Math.asin( boid.velocity.y / boid.velocity.length() ) * -1;               
                    seg.draw();
                })
            }
            Butterfly.Boid = class{
                constructor(){
                    
                    this.vector = new Butterfly.Vector3(),
                    this.acceleration, this.width = 1000, this.height = 1000, this.depth = 4000, this.goal, this.neighborhoodRadius = 50,
                    this.maxSpeed = 1.0, this.maxSteerForce = 0.01, this.avoidWalls = false;
                    this.position = new Butterfly.Vector3();
                    this.velocity = new Butterfly.Vector3();
                    this.acceleration = new Butterfly.Vector3();
                }
                setGoal( target ) {
                    this.goal = target;
                }
                setAvoidWalls ( value ) {
                    this.avoidWalls = value;
                }
                setWorldSize( width, height, depth ) {
                    this.width = width;
                    this.height = height;
                    this.depth = depth;
                }
                run( boids ) {
                    if ( this.avoidWalls ) {
                        this.vector.set( - this.width, this.position.y, this.position.z );
                        this.vector = this.avoid( this.vector );
                        this.vector.multiplyScalar( 5 );
                        this.acceleration.add( this.vector );
                        this.vector.set( this.width, this.position.y, this.position.z );
                        this.vector = this.avoid( this.vector );
                        this.vector.multiplyScalar( 5 );
                        this.acceleration.add( this.vector );
                        this.vector.set( this.position.x, - this.height, this.position.z );
                        this.vector = this.avoid( this.vector );
                        this.vector.multiplyScalar( 5 );
                        this.acceleration.add( this.vector );
                        this.vector.set( this.position.x, this.height, this.position.z );
                        this.vector = this.avoid( this.vector );
                        this.vector.multiplyScalar( 5 );
                        this.acceleration.add( this.vector );
                        this.vector.set( this.position.x, this.position.y, - this.depth );
                        this.vector = this.avoid( this.vector );
                        this.vector.multiplyScalar( 5 );
                        this.acceleration.add( this.vector );
                        this.vector.set( this.position.x, this.position.y, this.depth );
                        this.vector = this.avoid( this.vector );
                        this.vector.multiplyScalar( 5 );
                        this.acceleration.add( this.vector );
                    }/* else {
                        this.checkBounds();
                    }*/
                    if ( Math.random() > 0.5 ) {
                        this.flock( boids );
                    }
                    this.move();
                }
                flock( boids ) {
                    if ( this.goal ) {
                        this.acceleration.add( this.reach( this.goal, 0.005 ) );
                    }
                    this.acceleration.add( this.alignment( boids ) );
                    this.acceleration.add( this.cohesion( boids ) );
                    this.acceleration.add( this.separation( boids ) );
                }
                move() {
                    this.velocity.add( this.acceleration );
                    let l = this.velocity.length();
                    if ( l > this.maxSpeed ) {
                        this.velocity.divideScalar( l / this.maxSpeed );
                    }
                    this.position.add( this.velocity );
                    this.acceleration.set( 0, 0, 0 );
                }
                checkBounds() {
                    if ( this.position.x >   this.width ) this.position.x = - this.width;
                    if ( this.position.x < - this.width ) this.position.x =   this.width;
                    if ( this.position.y >   this.height ) this.position.y = - this.height;
                    if ( this.position.y < - this.height ) this.position.y =  this.height;
                    if ( this.position.z >  this.depth ) this.position.z = - this.depth;
                    if ( this.position.z < - this.depth ) this.position.z =  this.depth;
                }
                avoid( target ) {
                    let steer = new Butterfly.Vector3();
                    steer.copy( this.position );
                    steer.sub( target );
                    steer.multiplyScalar( 1 / this.position.distanceToSquared( target ) );
                    return steer;
                }
                repulse( target ) {
                    let distance = this.position.distanceTo( target );
                    if ( distance < 150 ) {
                        let steer = new Butterfly.Vector3();
                        steer.subVectors( this.position, target );
                        steer.multiplyScalar( 0.5 / distance );
                        this.acceleration.add( steer );
                    }
                }
                reach( target, amount ) {
                    let steer = new Butterfly.Vector3();
                    steer.subVectors( target, this.position );
                    steer.multiplyScalar( amount );
                    return steer;
                }
                alignment( boids ) {
                    let boid, velSum = new Butterfly.Vector3(), count = 0;
                    for ( let i = 0, il = boids.length; i < il; i++ ) {
                        if ( Math.random() > 0.6 ) continue;
                        boid = boids[ i ];
                        let distance = boid.position.distanceTo( this.position );
                        if ( distance > 0 && distance <= this.neighborhoodRadius ) {
                            velSum.add( boid.velocity );
                            count++;
                        }
                    }
                    if ( count > 0 ) {
                        velSum.divideScalar( count );
                        let l = velSum.length();
                        if ( l > this.maxSteerForce ) {
                            velSum.divideScalar( l / this.maxSteerForce );
                        }
                    }
                    return velSum;
                }
                cohesion( boids ) {
                    let boid, distance,
                    posSum = new Butterfly.Vector3(),
                    steer = new Butterfly.Vector3(),
                    count = 0;
                    for ( let i = 0, il = boids.length; i < il; i ++ ) {
                        if ( Math.random() > 0.6 ) continue;
                        boid = boids[ i ];
                        distance = boid.position.distanceTo( this.position );
                        if ( distance > 0 && distance <= this.neighborhoodRadius ) {
                            posSum.add( boid.position );
                            count++;
                        }
                    }
                    if ( count > 0 ) {
                        posSum.divideScalar( count );
                    }
                    steer.subVectors( posSum, this.position );
                    let l = steer.length();
                    if ( l > this.maxSteerForce ) {
                        steer.divideScalar( l / this.maxSteerForce );
                    }
                    return steer;
                }
                separation( boids ) {
                    let boid, distance,
                    posSum = new Butterfly.Vector3(),
                    repulse = new Butterfly.Vector3();
                    for ( let i = 0, il = boids.length; i < il; i ++ ) {
                        if ( Math.random() > 0.6 ) continue;
                        boid = boids[ i ];
                        distance = boid.position.distanceTo( this.position );
                        if ( distance > 0 && distance <= this.neighborhoodRadius ) {
                            repulse.subVectors( this.position, boid.position );
                            repulse.normalize();
                            repulse.divideScalar( distance );
                            posSum.add( repulse );
                        }
                    }
                    return posSum;
                }
            }
            Butterfly.Vector3 = class {
                constructor(x, y, z){
                    this.x = x || 0;
                    this.y = y || 0;
                    this.z = z || 0;
                }
                set(x, y, z){
                    this.x = x;
                    this.y = y;
                    this.z = z;
                    return this;
                }
                copy(v){
                    this.x = v.x;
                    this.y = v.y;
                    this.z = v.z;
                    return this;    
                }
                add(v){
                    this.x += v.x;
                    this.y += v.y;
                    this.z += v.z;
                    return this;
                }
                sub(v){
                    this.x -= v.x;
                    this.y -= v.y;
                    this.z -= v.z;
                    return this;
                }
                subVectors(a, b){
                    this.x = a.x - b.x;
                    this.y = a.y - b.y;
                    this.z = a.z - b.z;
                    return this;
                }
                multiplyScalar(scalar){
                    this.x *= scalar;
                    this.y *= scalar;
                    this.z *= scalar;
                    return this;
                }
                divideScalar(scalar){
                    return this.multiplyScalar( 1 / scalar );
                }
                distanceToSquared(v){
                    let dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
                    return dx * dx + dy * dy + dz * dz;
                }
                distanceTo(v){
                    return Math.sqrt( this.distanceToSquared( v ) );
                }
                length(){
                    return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
                }
                normalize(){
                    return this.divideScalar( this.length() || 1 );
                }
            }
            
            //
            // **********************************************************
            //
            
            Butterfly.setup();