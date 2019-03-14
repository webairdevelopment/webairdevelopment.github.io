//Some functions useful for pretty much everything.
Math.dist2D=function(x1,y1,x2,y2){return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))}
Math.dist3D=function(x1,y1,z1,x2,y2,z2){return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)+(z1-z2)*(z1-z2))}
var cells=[];//Will hold all the vertices. Why 'cells'? I plan to use this to make cellular automata.
//Cells on sphere. 
class Cell
  {
  constructor(x,y,z,setup)
    {
    this.x=x;
    this.y=y;
    this.z=z;
    this.nbors=[];
    this.color={h:Math.floor(360*Math.random()),s:100,l:50,a:1};//Random color
    if(typeof setup=='function'){setup(this);}//Function for setup.
    }
  static automaton(array)//Iterates an array containing cells set up to be cellular automata
    {
    for(var ind1=0;ind1<array.length;ind1++){array[ind1].rule()}
    for(var ind1=0;ind1<array.length;ind1++){array[ind1].update()}
    }
  static setupClouds(obj)//Sets up cell to be in a cloud cellular automata
     {
     obj.state0=Math.floor(Math.random()*3);
     obj.state1=0;
	   obj.cloud=0;
     obj.rule=function()
       {//The cloud automaton is based on the rock-paper-scissor automaton
       var rps=[0,0,0];
       for(var ind2=0;ind2<this.nbors.length;ind2++)
          {
          rps[this.nbors[ind2].state0]+=Math.random();
          }
       if ((rps[this.state0+1-3*Math.floor((this.state0+1)/3)])>1){this.state1=this.state0+1-3*Math.floor((this.state0+1)/3)}
       else{this.state1=this.state0}
		   if(this.state1==1)
			   {
			   this.cloud+=.8*(1-this.cloud);
			   }
		   else
			   {
			   this.cloud=Math.max(0,.8*this.cloud-.1);
			   }
       }
     obj.update=function()
       {
       this.state0=this.state1;
       var cloudiness=this.cloud;
       this.color={h:0,s:0,l:100,a:cloudiness};
       }
     }
  static setupVector(obj)//Sets up a cell that has a vector tangent to  the sphere
    {
    var mag=Math.sqrt(obj.x*obj.x+obj.y*obj.y);//magnitude x/y
    var cosH=obj.x/mag;
    var sinH=obj.y/mag;
    if(mag==0){cosH=1;sinH=0}
    var cosV=obj.z;
    var sinV=mag;
    var theta=Math.random()*Math.PI*2;
    //Unit vector in a flat plane
    var x0=Math.cos(theta);
    var y0=Math.sin(theta);
    var z0=0;
    //Move direction of the vector
    var x1=(x0*cosV+z0*sinV)*cosH-y0*sinH//Cartesian coordinates transformed by origin
	  var y1=(x0*cosV+z0*sinV)*sinH+y0*cosH;
	  var z1=z0*cosV-x0*sinV;
    //Creates vector in 3d space
    obj.vec={x:x1,y:y1,z:z1}
    obj.dot=function(x,y,z){return ((x-this.x)*this.vec.x+(y-this.y)*this.vec.y+(z-this.z)*this.vec.z)}
    }
  static setupTerra(obj)//Sets up a cell that can be used as planetary terrain
      {
      obj.gradients=[];
	    obj.worleys=[];
      obj.height=0;
      obj.color={h:0,s:0,l:50,a:1};
      obj.evalGradient=function(array)
        {
		    var total=0;
		    var rad=16/(array.length);//Radius square for falloff curve
        for(var ind=0;ind<array.length;ind++)
            {
			      var vect=array[ind];
			      var dist=(this.x-vect.x)*(this.x-vect.x)+(this.y-vect.y)*(this.y-vect.y)+(this.z-vect.z)*(this.z-vect.z);
			      var dot=vect.dot(this.x,this.y,this.z);
			      total+=dot/Math.exp(11*dist*dist/rad/rad);
            }
		    this.gradients.push(total);
        return total;
        }
	  obj.evalWorley=function(array)
      {
      var dists=[2,2,2];
      for(var ind=0;ind<array.length;ind++);
        {
        var point=array[ind];
        var dist=Math.dist3D(this.x,this.y,this.z,point.x,point.y,point.z);
        if(dist<dists[0])
          {
          dists[2]=dists[1];
          dists[1]=dists[0];
          dists[0]=dist;
          }
        else if(dist<dists[1])
          {
          dists[2]=dists[1];
          dists[1]=dist;
          }
        else if(dist<dists[2])
          {
          dists[2]=dist;
          }
        }
      this.worleys.push(dists);
      return dists;
      }
    }
  static vectorMap(size)//Returns an array of vectors, good for making gradient noise
    {
    var array=Cell.icosahedron(size,Cell.setupVector)
    return array;
    }
  static icosahedron(size,setup)//Creates cells arranged in an icosahedron
    {
    var array=[];
    var cardinals=[[0,0,1],
                   [Math.sqrt(3)*Math.cos(Math.PI/2.5)/2,    Math.sqrt(3)*Math.sin(Math.PI/2.5)/2,1/2],
                   [Math.sqrt(3)*Math.cos(2*Math.PI/2.5)/2,  Math.sqrt(3)*Math.sin(2*Math.PI/2.5)/2,1/2],
                   [Math.sqrt(3)*Math.cos(3*Math.PI/2.5)/2,  Math.sqrt(3)*Math.sin(3*Math.PI/2.5)/2,1/2],
                   [Math.sqrt(3)*Math.cos(4*Math.PI/2.5)/2,  Math.sqrt(3)*Math.sin(4*Math.PI/2.5)/2,1/2],
                   [Math.sqrt(3)*Math.cos(5*Math.PI/2.5)/2,  Math.sqrt(3)*Math.sin(5*Math.PI/2.5)/2,1/2],
                   [Math.sqrt(3)*Math.cos(1.5*Math.PI/2.5)/2,Math.sqrt(3)*Math.sin(1.5*Math.PI/2.5)/2,-1/2],
                   [Math.sqrt(3)*Math.cos(2.5*Math.PI/2.5)/2,Math.sqrt(3)*Math.sin(2.5*Math.PI/2.5)/2,-1/2],
                   [Math.sqrt(3)*Math.cos(3.5*Math.PI/2.5)/2,Math.sqrt(3)*Math.sin(3.5*Math.PI/2.5)/2,-1/2],
                   [Math.sqrt(3)*Math.cos(4.5*Math.PI/2.5)/2,Math.sqrt(3)*Math.sin(4.5*Math.PI/2.5)/2,-1/2],
                   [Math.sqrt(3)*Math.cos(5.5*Math.PI/2.5)/2,Math.sqrt(3)*Math.sin(5.5*Math.PI/2.5)/2,-1/2],
                   [0,0,-1]];
    var diamonds=[[1,0,6,2],[2,0,7,3],[3,0,8,4],[4,0,9,5],[5,0,10,1],
                  [6,2,11,7],[7,3,11,8],[8,4,11,9],[9,5,11,10],[10,1,11,6]];
    for(var aa=0;aa<10;aa++)
      {
      var point0=cardinals[diamonds[aa][0]];
      var point1=cardinals[diamonds[aa][1]];
      var point2=cardinals[diamonds[aa][2]];
      var point3=cardinals[diamonds[aa][3]];
      for(var bb=0;bb<size;bb++)
        {
        for(var cc=0;cc<size;cc++)
          {
          var coord1=(size-Math.max(bb,cc))/size;
          var coord2=(bb-cc)/size;
          var coord3=1-coord1-Math.abs(coord2);
          if(coord2>=0)
            {array.push(new Cell((coord1*point0[0]+coord2*point1[0]+coord3*point3[0]),
                                 (coord1*point0[1]+coord2*point1[1]+coord3*point3[1]),
                                 (coord1*point0[2]+coord2*point1[2]+coord3*point3[2]),
                                  setup));}
          else{array.push(new Cell((coord1*point0[0]-coord2*point2[0]+coord3*point3[0]),
                                   (coord1*point0[1]-coord2*point2[1]+coord3*point3[1]),
                                   (coord1*point0[2]-coord2*point2[2]+coord3*point3[2]),
                                    setup));}
          }
        }
      }
    array.push(new Cell(0,0,1,setup),new Cell(0,0,-1,setup))
    //Identifies neighbors
    for(var ind1=0;ind1<array.length-1;ind1++)
      {
      var cell1=array[ind1];
      for(var ind2=ind1+1;ind2<array.length;ind2++)
        {
        var cell2=array[ind2];
        if(((cell1.x-cell2.x)*(cell1.x-cell2.x)+(cell1.y-cell2.y)*(cell1.y-cell2.y)+(cell1.z-cell2.z)*(cell1.z-cell2.z))<=(1.2*1.2/size/size))
          {
          cell1.nbors.push(cell2);
          cell2.nbors.push(cell1);
          }
        }
      }
    for(var ind1=0;ind1<array.length;ind1++)
      {
      var cell1=array[ind1];
      var dist=Math.sqrt(cell1.x*cell1.x+cell1.y*cell1.y+cell1.z*cell1.z);
      cell1.x/=dist;cell1.y/=dist;cell1.z/=dist;
      }
    for(var ind1=0;ind1<array.length;ind1++)//Arranges the vertices of the cell polygons 
        {
        var cell1=array[ind1];
        var vertSort=[];
        //Angles for conversion
        var distH=Math.sqrt(cell1.x*cell1.x+cell1.y*cell1.y);
        var sinH=-cell1.y/distH;
        var cosH=cell1.x/distH;
        for(var ind2=0;ind2<cell1.nbors.length;ind2++)
          {
          var vertex=cell1.nbors[ind2];
          var nx=-vertex.z*distH+(vertex.x*cosH-vertex.y*sinH)*cell1.z;
          var ny=vertex.x*sinH+vertex.y*cosH;
          vertSort.push([vertex,Math.atan2(ny,nx)]);
          }
        vertSort.sort(function(a,b){return(a[1]-b[1])});
        cell1.nbors=[];
        for(var ind2=0;ind2<vertSort.length;ind2++)
          {
          cell1.nbors.push(vertSort[ind2][0]);
          }
        cell1.updateVerts()
        }
    return array;
    }
  static distribute(chunkArr,density,setup)//Uses a pre-made chunk array to create cells in a roughly evenly distributed pattern.
    {
    var array=[];//Will hold all cells
    for(var ind1=0;ind1<chunkArr.length;ind1++)
      {chunkArr[ind1].contents=[];//Initializes chunk arrays
       chunkArr[ind1].checked=false}
    var dist1=2/Math.sqrt(chunkArr.length)//Distance between chunk points
    var dist2=3/Math.sqrt(chunkArr.length*density)//Distance between cell points
    var arc=2*Math.asin(dist1/2);//Maximum angle from chunk of a new point
    for(var ind1=0;ind1<chunkArr.length;ind1++)//Cycles all chunks
      {
      //Variables relevant to the chunk
      var chunk1=chunkArr[ind1];
      var mag=Math.sqrt(chunk1.x*chunk1.x+chunk1.y*chunk1.y);//magnitude x/y
      var cosH=chunk1.x/mag;
      var sinH=chunk1.y/mag;
      if(mag==0){cosH=1;sinH=0}
      var cosV=chunk1.z;
      var sinV=mag;
      //Places random points until it can’t
      var tries=0;//How many failed tries to place a point
      while(tries<128)
	    {
	    //Generates the initial coordinatesof a random point
      	var thetaH=Math.PI*2*Math.random();//Speherical coordinates
      	var thetaV=arc*Math.sqrt(Math.random());
     	var x0=Math.cos(thetaH)*Math.sin(thetaV);//Initial cartesian coordinates
      	var y0=Math.sin(thetaH)*Math.sin(thetaV);
      	var z0=Math.cos(thetaV);
     	var x1=(x0*cosV+z0*sinV)*cosH-y0*sinH//Cartesian coordinates transformed by chunk
	    var y1=(x0*cosV+z0*sinV)*sinH+y0*cosH;
	    var z1=z0*cosV-x0*sinV;
        //Checks this point against all other points in the neighborhood
        var canAdd=true;
        for(var ind2=-1;ind2<chunk1.nbors.length;ind2++)
          {//Cycles all chunks in neighborhood 
          var chunk2=chunk1;
          if (ind2>0){chunk2=chunk1.nbors[ind2]}
          for(var ind3=0;ind3<chunk2.contents.length;ind3++)
            {//Cycles all other points in neighbiorhood
            var cell1=chunk2.contents[ind3];
            if(Math.dist3D(x1,y1,z1,cell1.x,cell1.y,cell1.z)<dist2)
              {//Checks if new point is too close to existing points. If so, ends the loops.
              canAdd=false;
              ind3=chunk2.contents.length;
              ind2=chunk1.nbors.length;
              tries++;
              }
            }
          }
        //If the point isn’t too close to any others, adds it to the cell array
        if(canAdd)
          {
          var cell1=new Cell(x1,y1,z1,setup);
          array.push(cell1);
          //Puts cell into a chunk
          var inChunk=chunk1;//First chunk to try
          var checkDist1=dist1;//Distance from centrral chunk
          for(var ind2=0;ind2<chunk1.nbors.length;ind2++)
            {
            var chunk2=chunk1.nbors[ind2];
            var checkDist2=Math.dist3D(x1,y1,z1,chunk2.x,chunk2.y,chunk2.z)
            if(checkDist2<checkDist1)
              {//If chunk2 iscloser than inChunk, updates
              checkDist1=checkDist2;
              inChunk=chunk2;
              }
            }
          inChunk.contents.push(cell1);//Puts cell into chunk contents
          }
        }
      }
    return array;
    }
  static setChunks(chunkArr,cellArr)//Takes an array of cells andsorts them  into chunks. Significantly improves performance.
    {
    var chunkRad=3.6/(chunkArr.length-2);
    for(var ind1=0;ind1<chunkArr.length;ind1++)//Clears chunk arrays
      {
      chunkArr[ind1].contents=[];
      chunkArr[ind1].checked=false;
      }
    for(var ind1=0;ind1<cellArr.length;ind1++)//Adds all cells to nearest chunk
      {
      var cell1=cellArr[ind1];
      var dist1=8;var chunk1=null;
      for(var ind2=0;ind2<chunkArr.length;ind2++)
        {
        var chunk2=chunkArr[ind2];
        var dist2=((cell1.x-chunk2.x)*(cell1.x-chunk2.x)+(cell1.y-chunk2.y)*(cell1.y-chunk2.y)+(cell1.z-chunk2.z)*(cell1.z-chunk2.z));
        if(dist2<dist1)
          {
          dist1=dist2;
          chunk1=chunk2;
          }
        }
      chunk1.contents.push(cell1);
      }
    }
  static triangulateChunks(chunkArr,cellArr,useNewChunks)//Given a set of chunks holding points on the surface of the sphere, creates a Delaunay triangulation
    {
    var tris=[];
    var maxDist=(.3*cellArr.length+58)/(cellArr.length+27);//Maximum distance cells will bother to  check
    if(useNewChunks){Cell.setChunks(chunkArr,cellArr);}//Chunks may already be set.
    for(var ind1=0;ind1<chunkArr.length;ind1++)//Cycles chunks
      {
      var chunk1=chunkArr[ind1];chunk1.checked=true;//Prevents excessive checking of this chunk
      var checkArray1=chunk1.contents;//All cells in the neighborhood to be triangulated
      var checkArray2=chunk1.contents;//All cells that must be checked in cones
      for(var ind2=0;ind2<chunk1.nbors.length;ind2++)//Puts contents whole neighborhood of chunk into one array
        {
        if(chunk1.nbors[ind2].checked==false){checkArray1=checkArray1.concat(chunk1.nbors[ind2].contents);}
        checkArray2=checkArray2.concat(chunk1.nbors[ind2].contents);  
        }
      for(var ind2=0;ind2<chunk1.contents.length;ind2++)//Cycles cells within chunk
        {
        var cell1=checkArray1[ind2];//First vertex to check
        for(var ind3=ind2+1;ind3<checkArray1.length-1;ind3++)//Cycles cells in and out of chunk
          {
          var cell2=checkArray1[ind3];//Second vertex to check
          if (((cell1.x-cell2.x)*(cell1.x-cell2.x)+(cell1.y-cell2.y)*(cell1.y-cell2.y)+(cell1.z-cell2.z)*(cell1.z-cell2.z))<maxDist*maxDist)
            {
            for(var ind4=ind3+1;ind4<checkArray1.length;ind4++)//Cycles more cells
              {
              var cell3=checkArray1[ind4];//Third vertex to check
              if (((cell1.x-cell3.x)*(cell1.x-cell3.x)+(cell1.y-cell3.y)*(cell1.y-cell3.y)+(cell1.z-cell3.z)*(cell1.z-cell3.z))<maxDist*maxDist
                &&((cell2.x-cell3.x)*(cell2.x-cell3.x)+(cell2.y-cell3.y)*(cell2.y-cell3.y)+(cell2.z-cell3.z)*(cell2.z-cell3.z))<maxDist*maxDist)
                {
                //Finds a vector perpendicular to the 3 vertices
                var vector1=[cell2.x-cell1.x,cell2.y-cell1.y,cell2.z-cell1.z];
                var vector2=[cell3.x-cell1.x,cell3.y-cell1.y,cell3.z-cell1.z];
                var cross=[vector1[1]*vector2[2]-vector1[2]*vector2[1]
                          ,vector1[2]*vector2[0]-vector1[0]*vector2[2]
                          ,vector1[0]*vector2[1]-vector1[1]*vector2[0]];
                //Dot product to compare all other cells against. Essentially defining a cone.
                var dot1=cell1.x*cross[0]+cell1.y*cross[1]+cell1.z*cross[2];
                var charge=dot1/Math.abs(dot1);
                //Checks to see if any points are within circumscribed cone
                var makeTri=true;
                for(var ind5=0;ind5<checkArray2.length;ind5++)//Cycles possible 'intuder points' that would prevent triangulation
                  {
                  var cell4=checkArray2[ind5];
                  if(cell4!=cell1&&cell4!=cell2&&cell4!=cell3)
                    {
                    if((charge*(cell4.x*cross[0]+cell4.y*cross[1]+cell4.z*cross[2]))>Math.abs(dot1))
                       {makeTri=false;break;}
                    }
                  }
                 if(makeTri)//If not, makes a triangle
                  {
                  //For drawing triangles
                  tris.push([cell1,cell2,cell3]);
                  //For adding neighbors
                  if(!cell1.nbors.includes(cell2)){cell1.nbors.push(cell2)}
                  if(!cell1.nbors.includes(cell3)){cell1.nbors.push(cell3)}
                  if(!cell2.nbors.includes(cell1)){cell2.nbors.push(cell1)}
                  if(!cell2.nbors.includes(cell3)){cell2.nbors.push(cell3)}
                  if(!cell3.nbors.includes(cell2)){cell3.nbors.push(cell2)}
                  if(!cell3.nbors.includes(cell1)){cell3.nbors.push(cell1)}
                  }
                }
              }
            }
          }
        }
      }
    for(var ind1=0;ind1<cellArr.length;ind1++)//Arranges the vertices of the cell polygons 
        {
        var cell1=cellArr[ind1];
        var vertSort=[];
        //Angles for conversion
        var distH=Math.sqrt(cell1.x*cell1.x+cell1.y*cell1.y);
        var sinH=-cell1.y/distH;
        var cosH=cell1.x/distH;
        for(var ind2=0;ind2<cell1.nbors.length;ind2++)//Cycles cell's neighbors
          {
          var vertex=cell1.nbors[ind2];
          var nx=-vertex.z*distH+(vertex.x*cosH-vertex.y*sinH)*cell1.z;
          var ny=vertex.x*sinH+vertex.y*cosH;
          vertSort.push([vertex,Math.atan2(ny,nx)]);
          }
		//Arrangesneighborsby angle
        vertSort.sort(function(a,b){return(a[1]-b[1])});
        cell1.nbors=[];
        for(var ind2=0;ind2<vertSort.length;ind2++)
          {
          cell1.nbors.push(vertSort[ind2][0]);
          }
        cell1.updateVerts()
        }
    }
  updateVerts()//Sets the vertices to the barycenters of triads of neighbors
    {
    this.verts=[];
    var nbor1=this.nbors[this.nbors.length-1]
    for(var ind=0;ind<this.nbors.length;ind++)
      {
      var nbor2=this.nbors[ind];
      this.verts.push([(this.x+nbor1.x+nbor2.x)/3,
                       (this.y+nbor1.y+nbor2.y)/3,
                       (this.z+nbor1.z+nbor2.z)/3])
      nbor1=nbor2;
      }
    }
  static drawAll(array,x,y,scale,hor,vert,ctx,lightSrc)//Draws all cells in a chunk
    {
    ctx.globalAlpha=1;
    var horizon=0//-Math.sin(2*Math.asin(1/Math.sqrt(array.length)));
    var cosH=Math.cos(hor);//Though I could save some computation by not having it calculate trig values over and over.
    var sinH=Math.sin(hor);
    var cosV=Math.cos(vert);
    var sinV=Math.sin(vert);
    for(var ind1=0;ind1<array.length;ind1++)//Cyclesall chunks
      {
      var chunk1=array[ind1];
      //var chunkZIndex=scale*(-(sinH*chunk1.x+cosH*chunk1.y)*sinV+cosV*chunk1.z)
      if(scale*(-(sinH*chunk1.x+cosH*chunk1.y)*sinV+cosV*chunk1.z)>=horizon)//If chunk above horizon
        {
        for(var ind2=0;ind2<chunk1.contents.length;ind2++)//Cycles all cells in chunk
          {
          var cell1=chunk1.contents[ind2];
          if(scale*(-(sinH*cell1.x+cosH*cell1.y)*sinV+cosV*cell1.z)>=horizon)//If cell above horizon
            {
            var cx=scale*(cosH*cell1.x-sinH*cell1.y);//Coordinates of center of cell on screen
            var cy=scale*((sinH*cell1.x+cosH*cell1.y)*cosV+sinV*cell1.z);
            ctx.beginPath();
            for(var ind3=0;ind3<cell1.verts.length;ind3++)//Cycles all vertices of cell
              {
              var nx=scale*(cosH*cell1.verts[ind3][0]-sinH*cell1.verts[ind3][1]);//Coordsof vertex on screen
              var ny=scale*((sinH*cell1.verts[ind3][0]+cosH*cell1.verts[ind3][1])*cosV+sinV*cell1.verts[ind3][2]);
              nx+=((nx>cx)-(nx<cx))*.25;//Fills in edges between vertices. Otherwise,background shows through.
              ny+=((ny>cy)-(ny<cy))*.25;
              //var nz=scale*(-(sinH*cell1.verts[ind3][0]+cosH*cell1.verts[ind3][1])*sinV+cosV*cell1.verts[ind3][2])
              if(ind3==0){ctx.moveTo(x+nx,y+ny)}//Adds vertex to path
              else{ctx.lineTo(x+nx,y+ny)}
              }
            //Calculates lighting. lightSrc={x,y,z,bright}. Assumes that normal vector is normal to sphere
            var dist=Math.dist3D(cell1.x,cell1.y,cell1.z,lightSrc.x,lightSrc.y,lightSrc.z);
            var bright=.6*Math.min(1,lightSrc.bright*(cell1.x*(lightSrc.x)+cell1.y*(lightSrc.y)+cell1.z*(lightSrc.z))/dist)+.2;
			      //Fills path 
            ctx.closePath();
            ctx.fillStyle=`hsl(${cell1.color.h},${cell1.color.s}%,${cell1.color.l*bright}%,${cell1.color.a})`;
            ctx.fill();
            }
          }
        }
      }
    }
  static terrain(array)//Uses noise to make a beautiful terrain
    {
    for(var oct=0;oct<4;oct++)//Generates several octaves of noise
      {
      var map=Cell.vectorMap(2*(oct+1));//Gradint vectors
      var valMin=0;var valMax=0;//Minimum and maximum values. Will be used to scale each octave to 0<h<1
      for(var ind=0;ind<array.length;ind++)
        {
        var newval=array[ind].evalGradient(map);//Evaluates gradient 
        valMin=Math.min(valMin,newval);
        valMax=Math.max(valMax,newval);
        }
      for(var ind=0;ind<array.length;ind++)
        {
        var oldval=array[ind].gradients[array[ind].gradients.length-1];//Rescales noisemap
        array[ind].gradients[array[ind].gradients.length-1]=(oldval-valMin)/(valMax-valMin);
        }
      }
    for(var ind=0;ind<array.length;ind++)
      {
      var point=array[ind];//Cycles through terrain points, evaluates color
      var height=1.5*(point.gradients[0]//Findstotal elevation based on noisemap
                  +Math.abs(2*point.gradients[1]-1)/2
                  +Math.abs(2*point.gradients[2]-1)/4
                  +Math.abs(2*point.gradients[3]-1)/8)*8/15;
      var latt=Math.abs(point.z);//'Lattitude' of point
	  //Uses latitude and elevation to determine color
      if(height>.6)//If on land...
        {
        if(latt>(.9-Math.pow(height,6)))//If snowy...
          {
          point.color={h:177,s:15,l:Math.floor(80+height*20),a:1};
          }
        else
          {
          if(latt>(2.5-3.5*height*height))//If rocky...
            {
            point.color={h:104,s:9,l:Math.floor(20+30*height),a:1};
            }
           else//If lush...
            {
            point.color={h:108,s:55,l:Math.floor(10+50*height),a:1};
            }
          }
        }
      else//If below sea...
         {
         if(latt>(.9-.8*Math.pow(height,6)))//If frozen...
           {
           point.color={h:177,s:15,l:Math.floor(90+height*20),a:1}; 
           }
         else//If clear...
           {
           point.color={h:221,s:100,l:Math.floor(height*100),a:1};
           }
         }
      }
    }
}
class Star
	{
	constructor()
		{
		this.z=2*Math.random()-1;//Randomly chosen coordinates
		var theta=2*Math.PI*Math.random();
		this.x=Math.sqrt(1-this.z*this.z)*Math.cos(theta);
		this.y=Math.sqrt(1-this.z*this.z)*Math.sin(theta);
		var hue=Math.floor(64*Math.random());//Red stars
		if(Math.random()>.75){hue=180+80*Math.random()}//Blue stars
		this.color=`hsl(${hue},
						${Math.floor(100*Math.random())}%,
						${75+25*Math.random()}%)`;
		this.radius=1+Math.random()*4;//Attributes of star to the sky some variety
		this.rays=Math.floor(6*Math.random());
		this.glare=1+2*Math.random();
		}
	draw(x,y,scale,hor,vert,ctx,layerCount)//Draws a star
		{
		var x1=x+scale*(this.x*Math.cos(hor)-this.y*Math.sin(hor));//Coordinates realtive of center of star sphere
		var y1=y+scale*((this.x*Math.sin(hor)+this.y*Math.cos(hor))*Math.cos(vert)-this.z*Math.sin(vert));
		var z1=scale*((this.x*Math.sin(hor)+this.y*Math.cos(hor))*Math.sin(vert)+this.z*Math.cos(vert));
    var bound=this.radius*this.glare*scale/500;
		if(z1>0&&x1>-bound&&x1<canvas.width+bound&&y1>-bound&&y1<canvas.height+bound)//If star on screen, draws
			{
			//Sets upfor drawing
			ctx.lineCap='round';
			ctx.globalAlpha=.2
			for(var layer=0;layer<layerCount;layer++)//Draws star afew times over to get an alpha gradient
				{
				ctx.beginPath();
				var scale2=scale*(1+layer/layerCount)/1000;
				ctx.arc(x1,y1,this.radius*scale2,0,Math.PI*2);//Draws center of star
				for(var ray=0;ray<this.rays;ray++)//Draws rays of star
					{
					for(var angle=0;angle<2*ray;angle++)
						{
						ctx.moveTo(x1+(1-ray/8)*scale2*this.radius*this.glare*Math.cos(Math.PI*angle/ray/2),
								       y1+(1-ray/8)*scale2*this.radius*this.glare*Math.sin(Math.PI*angle/ray/2));
						ctx.lineTo(x1-(1-ray/8)*scale2*this.radius*this.glare*Math.cos(Math.PI*angle/ray/2),
								       y1-(1-ray/8)*scale2*this.radius*this.glare*Math.sin(Math.PI*angle/ray/2));
						}
					}
				//Strokes/fills the path created
				ctx.fillStyle=this.color;
				ctx.strokeStyle=this.color;
				ctx.lineWidth=scale2;
				ctx.stroke();ctx.fill();
				}
			}
		}
	}

//Initializes canvas
var canvas=document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
canvas.style="position:absolute;left:0px;top:0px;background-color:black;"
var ctx=canvas.getContext('2d');
var scale=Math.sqrt(canvas.width*canvas.width/4+canvas.height*canvas.height/4);
document.body.onresize=function(){canvas.width=window.innerWidth;
                                  canvas.height=window.innerHeight;
                                  scale=Math.sqrt(canvas.width*canvas.width/4+canvas.height*canvas.height/4);}
  
//Generates planet, stars, and atmosphere
//Different steps are timed to test performance
console.time('gen')
//Generates Stars and sun
	var stars=[];
	for(var i=0;i<1000;i++){stars.push(new Star)};
  var sun=new Star;sun.radius=50;sun.glare=2;sun.rays=4;sun.color=`hsl(45,100%,57%)`;sun.x=0;sun.y=1;sun.z=0;
//Sets up planetary surface
	console.time('ico');//First, generates an icosahedron that will be used as chunks to divide up work
	var chunks=Cell.icosahedron(12,function(obj){});console.timeEnd('ico');
	console.time('dist');
	var ground=Cell.distribute(chunks,8,Cell.setupTerra);console.log(cells.length);//Uses chunks to distribute terrain points
	console.timeEnd('dist');
	console.time('tri');
	Cell.triangulateChunks(chunks,ground,false);console.timeEnd('tri');//Does a chunk-by-chunk Delaunay triangulation
	console.time('terra');
	Cell.terrain(ground);console.timeEnd('terra');//Colrizes it to look like a globe
//Sets up clouds
	var chunks2=Cell.icosahedron(8,function(obj){});//Creates chunks
	var clouds=Cell.distribute(chunks2,8,Cell.setupClouds);console.log(cells.length);//Distributes points
	console.timeEnd('dist');
	console.time('tri');
	Cell.triangulateChunks(chunks2,clouds,false);console.timeEnd('tri')//Triangulates
console.timeEnd('gen');

//This function, called on every frame, both draws the objects as well as increments variables and iterates the automaton.
var t=0;
var vert=Math.PI/2;
var hor=0;
var int=setInterval(function(){
  Cell.automaton(clouds);//Iterates atmosphere
  t-=.005;sun.y=Math.cos(t);sun.x=Math.sin(t);sun.z=-Math.sin(t/36)*.38///Changes sun position. Sorry about the geocentrism. Galileo would be dissapointed.
  var light={x:sun.x,y:sun.y,z:sun.z,bright:1}
  hor+=.01;
  ctx.clearRect(0,0,canvas.width,canvas.height);//Clears the drawing space
  for(var ind=0;ind<stars.length;ind++){stars[ind].draw(canvas.width/2,canvas.height/2,1.6*scale,hor,vert,ctx,5)}//draws stars
  sun.draw(canvas.width/2,canvas.height/2,1.4*scale,hor,vert,ctx,20);
  Cell.drawAll(chunks,canvas.width/2,canvas.height/2,canvas.height*3/8,hor,vert,ctx,light);//Draws planet
  Cell.drawAll(chunks2,canvas.width/2,canvas.height/2,1.1*canvas.height*3/8,hor,vert,ctx,light);//Draws atmosphere
  
  },100)