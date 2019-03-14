class App {
  
  constructor() {
    
    this.randFrom = [
      'first',
      'last',
      'center'
    ];
    
    this.easing = [
      'linear',
      'easeInOutQuad',
      'easeInOutCubic',
      'easeInOutQuart',
      'easeInOutQuint',
      'easeInOutSine',
      'easeInOutExpo',
      'easeInOutCirc',
      'easeInOutBack',
      'cubicBezier(.5, .05, .1, .3)',
      'spring(1, 80, 10, 0)',
      'steps(10)'
    ];
    
    this.randFromText = document.getElementById('randFrom');
    this.randEasingText = document.getElementById('randEasing'); 
  }

  init() {

      this.camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 0.1, 1000 );
      this.camera.position.x = -45;
      this.camera.position.y = 20;
      this.camera.position.z = -45;
    
      this.controls = new THREE.OrbitControls(this.camera);
      this.controls.target = new THREE.Vector3(5,-5,5);

      this.scene = new THREE.Scene();
    
      this.resizeListener = e => this.onResize(e);
	    window.addEventListener( 'resize', this.resizeListener, false );
    
      this.createBoxes();

      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });

      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize( window.innerWidth, window.innerHeight );

      document.body.appendChild( this.renderer.domElement );
    
      this.beginAnimationLoop();

      this.animate();
  }
  
  createBoxes() {
    this.geometry = new THREE.BoxBufferGeometry(1, 10, 1);
    
    let vertexShader = `
      varying vec3 vPos;
      void main()	{
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `;
    
    let fragmentShader = `
      varying vec3 vPos;
      uniform vec3 size;
      uniform float thickness;
      uniform float smoothness;

      void main() {

        float a = smoothstep(thickness, thickness + smoothness, length(abs(vPos.xy) - size.xy));
        a *= smoothstep(thickness, thickness + smoothness, length(abs(vPos.yz) - size.yz));
        a *= smoothstep(thickness, thickness + smoothness, length(abs(vPos.xz) - size.xz));

        vec3 c = mix(vec3(1), vec3(0), a);

        gl_FragColor = vec4(c, 1.0);
      }
    `;
    
    let material = new THREE.ShaderMaterial({
      uniforms: {
        size: {
          value: new THREE.Vector3(0.5, 5, 0.5)
        },
        thickness: {
          value: 0.01
        },
        smoothness: {
          value: 0.05
        }
      },
      vertexShader,
      fragmentShader
    });
    
    let cube = new THREE.Mesh( this.geometry, material );      
    
    let offset = 1.25;
    this.nRows = 25;
    this.nCols = 25;
    this.staggerArray = [];
    
    for(var column = 0; column < this.nCols; column++) {
      for(var row = 0; row < this.nRows; row++) {
        let obj = cube.clone();
        obj.position.x = (row * offset) - ((this.nRows*0.5) + (this.geometry.parameters.width*0.5));
        obj.position.y = -(this.geometry.parameters.height*0.5);
        obj.position.z = (column * offset) - ((this.nCols*0.5) + (this.geometry.parameters.width*0.5));
        this.staggerArray.push(obj.position);
        this.scene.add(obj);
      }
    }
  }
  
  beginAnimationLoop() {
     
    // random from array
    let randFrom = this.randFrom[Math.floor(Math.random()*this.randFrom.length)];
    let easingString = this.easing[Math.floor(Math.random()*this.easing.length)];
    
    this.randFromText.textContent = randFrom;
    this.randEasingText.textContent = easingString;
    
    anime({
      targets: this.staggerArray,
      y: [
        {value: (this.geometry.parameters.height*0.25), duration: 500},
        {value: -(this.geometry.parameters.height*0.25), duration: 2000},
      ],
      delay: anime.stagger(200, {grid: [this.nRows, this.nCols], from: randFrom}),
      easing: easingString,
      complete: (anim) => this.beginAnimationLoop()
    });
    
  }

  animate() {

      requestAnimationFrame( () => this.animate() );
      this.update();
      this.render();
  }

  update() {
     
    // update orbit controls
    if(this.controls) {
      this.controls.update();
    }
  }

  render() {
    this.renderer.render( this.scene, this.camera );
  }
  
  onResize() {

    // scene & camera update
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }
  
}

let app = new App();
app.init();