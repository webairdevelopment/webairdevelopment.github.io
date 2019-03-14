    var
			c1 , c2 , c3 , c4
		;
		
		c1 = c2 = c3 = c4 = 0.0 ;
		
		function control( DD ){
		
			switch( DD ){
			
				case 'cima' :
					c2+=0.1;
					if( c2 > 0.3 ){ c2 = 0.3 }
					if( c3 < 0.0 ){ c3+=0.1 }
					if( c3 > 0.0 ){ c3-=0.1 }
					if( c1 < 0.0 ){ c1+=0.1 }
					if( c1 > 0.0 ){ c1-=0.1 }
					if(c4>0.0){c4-=0.1}
					if(c4<0.0){c4+=0.1}
				break;
				case 'baixo' :
					c2-=0.1;
					if( c2 < -0.4 ){ c2 = -0.4 }
					if( c3 < 0.0 ){ c3 +=0.1 }
					if( c3 > 0.0 ){ c3 -=0.1 }
					if( c1 < 0.0 ){ c1+=0.1 }
					if( c1 > 0.0 ){ c1-=0.1 }
					if(c4>0.0){c4-=0.1}
					if(c4<0.0){c4+=0.1}
				break;
				case 'esquerdo' :
					c3-=0.1;
					if( c3 < -0.9 ){ c3 = -0.9 }
					if( c2 > 0.0 ){ c2-=0.1  }
					
					c1-=0.1;
					if(c1<-0.4){c1=-0.4}
					
					if(c4<0.0){c4+=0.1}
				break;
				case 'direito' :
					c3+=0.1;
					if( c3 > 0.9 ){ c3 = 0.9 }
					if( c2 > 0.0 ){ c2-= 0.1 }
					if( c2 < 0.0 ){ c2+= 0.1 }
					
					c1+=0.1;
					if(c1>0.4){c1=0.4}
					
					if(c4>0.0){c4-=0.1}
				break;
				case 'toptop' :
					c2+=0.1;
					if( c2 > 0.4 ){ c2 = 0.4 }
					c3-=0.1;
					if( c3 < -0.9 ){ c3 = -0.9 }
					
					c1-=0.1;
					if(c1<-0.2){c1=-0.2}
					
					if(c4<0.0){c4+=0.1}
				break;
				case 'rightdown' :
					c2-=0.1;
					if( c2 < -0.5 ){ c2 = -0.5 }
					c3-=0.1;
					if( c3 < -0.8 ){ c3 = -0.8 }
					
					c1-=0.1;
					if(c1<-0.5){c1=-0.5}
					
					c4-=0.1;
					if(c4<-0.2){c4=-0.2}
				break;
				case 'lefttop' :
					c2+=0.1;
					if( c2 > 0.4 ){ c2 = 0.4 }
					c3+=0.1;
					if( c3 > 0.9 ){ c3 = 0.9 }
					
					c1+=0.1;
					if(c1>0.2){c1=0.2}
					
					if(c4>0.0){c4-=0.1}
				break;
				case 'downdown' :
					c2-=0.1;
					if( c2 < -0.4 ){ c2 = -0.4 }
					c3+=0.1;
					if( c3 > 0.9 ){ c3 = 0.9 }
					
					c1+=0.1;
					if(c1>0.5){c1=0.5}
					
					c4+=0.1;
					if(c4>0.2){c4=0.2}
				break;
				case 'meio' :
					if(c2>0.0){c2-=0.1;}
					if(c2<0.0){c2+=0.1;}
					if(c3>0.0){c3-=0.1;}
					if(c3<0.0){c3+=0.1;}
					if(c1<0.0){c1+=0.1}
					if(c1>0.0){c1-=0.1}
					if(c4>0.0){c4-=0.1}
					if(c4<0.0){c4+=0.1}
				break;
			
			}
		
		}
	
		function setup(){
		
			createCanvas( 500 , 500 , WEBGL );
		
		}
		function draw(){
		
			background("rgba(0,0,0,.0)");
			
			
			rotateX( 0);
			
			specularMaterial(255);
			ambientLight( 50 , 50 , 50 );
			pointLight( 200,200,200,-100,-100,200);
			pointLight( 200,200,200,100,-100,200);
			pointLight( 200,200,200,0,-100,200);
			pointLight( 200,200,200,0,100,200);
			pointLight( 200,200,200,100,100,200);
			pointLight( 200,200,200,-100,100,200);
			pointLight( 0,0,255,0,0,150);
			
			push();
				rotateY( c1 );						//  		CONTROL BODY CORPO
				box( 130 , 100 , 130 );// MEIO
			pop();
			push();
				//rotateY( frameCount*0.01 );
				translate( 0 , 90 );//BAIXO
				stroke(150);
				rotateY(c4);
				sphere( 40 );
			pop();
			push();
				//rotateY( frameCount*0.01 );
				translate( 0 , - 95 );//TOPO
				rotateX(c2);// +/- = 0.1 MAX 0.2 DOWN MAX 0.4		//  		CONTROL CABEÇA  -  2
				rotateY(c3);// +/- = 0.1 MAX 0.9
				box( 80 , 70 , 80 );
				//olhos
				fill("#000");
				noStroke();
				translate( -20 , - 0 , 40 );//TOPO
				sphere(5);
				translate( 40 , - 0 , 0 );//TOPO
				sphere(5);
			pop();
			push();
				fill("rgba(0,0,0,.4)");
				noStroke();
				rotateX(1.56);
				translate( 0 , 0 , -130 );
				rotateZ( -c1 );//  		CONTROL SHADOW
				plane( 200 );
			pop();
		
		}