
var
			esp,
			c ,
			
			// vars gravity
			
			forcaX ,
			forcaY ,
			X , Y ,
			gravityX ,
			gravityY ,
			pressaoX ,
			pressaoY ,
			tecla ,
			mY
		;
		
		forcaX = 0 ;
		forcaY = 0 ;
		X = 0 ; 
		Y = 0 ;
		gravityX = 0 ;
		gravityY = 0.1 ;
		pressaoX = 0.9 ;
		pressaoY = 0.5  ;
		mY = 0 ;
		
		//======================
		
		esp = document.getElementById("esp");
		esp.width = 500;esp.height = 500;
		c = esp.getContext("2d");
		
		document.addEventListener("keydown", control );
		document.addEventListener("keyup", controll );
			
		function control(e){
			e = e || window.event;
			tecla = e.which || e.keyCode;
			
			if( tecla == 40 ){
				mY = 0 ;
			}
			if( tecla == 38 ){
				mY = 1 ;
			}
			
		}
		function controll(){
			tecla = "soltou" ;
		}
		
		function graphics(){
		
			c.strokeStyle = "#fff" ;
			c.lineWidth = 5 ;
		
			c.beginPath();
				c.moveTo( 0 , 450 );
				c.lineTo( 500 , 450 );
				c.stroke();
			c.closePath();
			
			c.beginPath();
				c.moveTo( 0 , 50 );
				c.lineTo( 500 , 50 );
				c.stroke();
			c.closePath();
			
			c.beginPath();
				c.strokeRect( X , Y , 50 , 50 );
			c.closePath();
			
			c.fillStyle = "#000" ;
			
			c.beginPath();
				c.font="20px arial";
				c.fillText( "--Use the arrow keys--",150,30);
				c.fillText( "--test gravity--",190,480);
			c.closePath();
		
		}
		
		
		
		window.setInterval( function loopSetup(){
		
			c.clearRect( 0 , 0 , esp.width , esp.height );
			
			
			if( mY == 0 ){ 
				forcaY += gravityY ;
				Y += forcaY ;
			}
			
			if( mY == 1 ){
				forcaY -= gravityY ;
				Y += forcaY - 1 ;
			}
			
			if( X >= 450 ){
				gravityX = 0.1 ;
				forcaX = forcaX * - pressaoX ;
				X = 450 ;
			}
			if( X <= 0 ){
				gravityX = 0.1 ;
				forcaX = forcaX * - pressaoX ;
				X = 0 ;
			}
			
			if( Y >= 400 ){
				forcaY = forcaY * - pressaoY ;
				Y = 400 ;
			}
			
			if( Y <= 50 ){
				forcaY = forcaY * - pressaoY ;
				Y = 50 ;
			}
			
			//control
			
			if( tecla == 39 ){
				X+=4;
			}
			if( tecla == 37 ){
				X-=4;
			}
		
		graphics();},1000/60);