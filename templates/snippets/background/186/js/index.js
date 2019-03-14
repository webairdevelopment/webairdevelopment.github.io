const WIDTH = window.innerWidth , HEIGHT = window.innerHeight;
            const Human = class {
                constructor(i) {
                    this.index = i;
                    this.bones = Object.assign({}, Human.Bones);
                    this.segments = {};
                    for(let bone in this.bones){
                        var b = Human.Bones[bone];
                        if(typeof b == 'object' && b.parent) this.segments[bone] = new Human.Segment(d3.select('#svg'),b,bone,this);
                    };
                    let ikL = new Human.ArmIK(this.segments['Arm1_L'],this.segments['Arm2_L']);
                    Human.Mouse.addIK(ikL.move.bind(ikL));
                    let ikR = new Human.ArmIK(this.segments['Arm1_R'],this.segments['Arm2_R']);
                    Human.Mouse.addIK(ikR.move.bind(ikR));
                    Human.Mouse.addIK(this.move.bind(this));
                    this.ikLeg = new Human.LegIK(this.segments['Leg1_L'],this.segments['Leg1_R'])
                    this.onEnterFrame();
                }
                onEnterFrame(){
                    requestAnimationFrame(this.onEnterFrame.bind(this));
                    this.ikLeg.walk();
                    for(let bone in this.bones){
                        var b = Human.Bones[bone];
                        if(typeof b == 'object' && b.parent) this.segments[bone].draw();
                    };
                }
                move(x,y){
                     let myX = this.bones['Base'].childX;
                     let length = x - myX;
                     if(Math.abs(length) > 1){
                         let vx = length / 20;
                         this.bones['Base'].childX += vx;
                     }
                }
            }
            Human.Mouse = {
                setup(){
                    this.x = 0;
	this.y = 0;
                    window.addEventListener("mousemove", e => this.move(e), false);
                    this.IK = []
                },
                addIK(p){
                    this.IK.push(p);
                },
                move(e){
                    this.x = e.clientX - WIDTH / 2;
	this.y = e.clientY - HEIGHT / 2;
                    this.IK.forEach(ik => ik(this.x,-this.y));
                }
            }
            Human.Bones = {
                Base :          {childX:0  , childY:0 , width:0  ,     angle:0 },
                Body :          {childX:30 , childY:0 , width:50 ,     angle:90*Math.PI/180 ,  parent:'Base' },
                Hips :          {childX:30 , childY:0 , width:50 ,     angle:270*Math.PI/180 , parent:'Base' },
                Head :          {childX:30 , childY:0 , width:50 ,     angle:90*Math.PI/180 ,  parent:'Body' },
                shoulder_L :    {childX:30 , childY:0 , width:50 ,     angle:0*Math.PI/180 ,   parent:'Body' },
                Arm1_L :        {childX:55 , childY:0 , width:75 ,     angle:0*Math.PI/180 ,   parent:'shoulder_L' },
                Arm2_L :        {childX:55 , childY:0 , width:75 ,     angle:0*Math.PI/180 ,   parent:'Arm1_L' },
                shoulder_R :    {childX:30 , childY:0 , width:50 ,     angle:180*Math.PI/180 , parent:'Body' },
                Arm1_R :        {childX:55 , childY:0 , width:75 ,     angle:180*Math.PI/180 , parent:'shoulder_R' },
                Arm2_R :        {childX:55 , childY:0 , width:75 ,     angle:180*Math.PI/180 , parent:'Arm1_R' },
                LegB_L :        {childX:30 , childY:0 , width:50 ,     angle:0*Math.PI/180 ,   parent:'Hips' },
                LegB_R :        {childX:30 , childY:0 , width:50 ,     angle:180*Math.PI/180 , parent:'Hips' },
                Leg1_L :        {childX:80 , childY:0 , width:100 ,    angle:270*Math.PI/180 , parent:'LegB_L' },
                Leg2_L :        {childX:80 , childY:0 , width:100 ,    angle:270*Math.PI/180 , parent:'Leg1_L' },
                Leg1_R :        {childX:80 , childY:0 , width:100 ,    angle:270*Math.PI/180 , parent:'LegB_R' },
                Leg2_R :        {childX:80 , childY:0 , width:100 ,    angle:270*Math.PI/180 , parent:'Leg1_R' },
                getMyPosition(b,p) {
                    if(b.parent) this.getMyPosition(this[b.parent],p);
                    Human.Matrix.identity();
                    if(b.parent) Human.Matrix.rotation(b.angle);
                    let cp = Human.Matrix.multiplyVertex({x:b.childX,y:b.childY});
                    p.x += cp.x;
                    p.y += cp.y;                    
                }
            }
            Human.Segment = class{
                constructor(svg,b,n,o) {
                    this.owner = o;
                    this.svg = svg;
                    this.name = n;
                    this.bone = b;
                    this.index = o.index;
                    this.parent = Human.Bones[b.parent];
                    this.segment = this.copySelection(this.svg.select('#segment'),this.svg);
                    this.segment.attr('id',this.name+this.index).attr('visibility','visible');
                    this.segment.select('rect').attr('width',this.bone.width);
                    this.draw();                    
                }
                draw(){
                    this.myPosition = {x:0,y:0};
                    this.owner.bones.getMyPosition(this.parent,this.myPosition);
                    let angle = this.bone.angle * 180 / Math.PI;
                    var transfor = 'translate('+this.myPosition.x+','+this.myPosition.y+') rotate('+angle+')';
                    this.segment.select('.child').attr('cx',this.bone.childX).attr('cy',this.bone.childY);
	this.segment.attr('transform',transfor)
                }
                copySelection( $target, $to ) {
                   let node = $target.node();
                   let {nodeName, attributes, children} = node;
                   let $copy = $to.append(nodeName);
                   Object.keys(attributes).forEach((key) => {
                       $copy.attr(attributes[key].name, attributes[key].value);
                   });
                   $copy.html($target.html());
                   return $copy;
                }
            }
            Human.ArmIK = class{
                constructor(s1,s2) {
                    this.segment0 = s1;
                    this.segment1 = s2;
                    this.bone0 = s1.owner.bones[s1.name];
                    this.bone1 = s2.owner.bones[s2.name];
                }
                reach(s,x,y,b){
                    let pos = s.myPosition;
                    let dx = x - pos.x;
                    let dy = y - pos.y;
                    b.angle = Math.atan2(dy, dx);
                }
                move(x,y){
                    this.reach(this.segment0,x,y,this.bone0);
                    this.reach(this.segment1,x,y,this.bone1);
                }
            }
            Human.LegIK = class{
                constructor(s1,s2) {
                    this.LeftLeg = s1;
                    this.RigthLeg = s2;
                    this.boneLeft = s1.owner.bones[s1.name];
                    this.boneRigth = s2.owner.bones[s2.name];
                    this.times = 0;
                    this.angleVec = (10 / 5) * Math.PI / 180;
                    this.sw = true;
                    this.cycleLeft = [1,2,3,4,5,-1,-2,-3,-4,-5];
                    this.cycleRigth = [-1,-2,-3,-4,-5,1,2,3,4,5];
                }
                walk(){
                    let a;
                    if(this.sw){
                        a = this.cycleLeft[this.times++] * this.angleVec;
                        this.boneLeft.angle += a;
                    }else{
                        a = this.cycleRigth[this.times++] * this.angleVec;
                        this.boneRigth.angle += a;
                    }
                    this.times = this.times % this.cycleLeft.length;
                    if(this.times == 0){
                        if(this.sw) this.sw = false;
                        else this.sw = true;
                    }
                }
            }
            Human.Matrix = {
                setup() {
                    this.a = 1 ;
	this.b = 0 ;
	this.c = 0 ;
	this.d = 1 ;
                },
                identity(){
	this.a = 1 ;
	this.b = 0 ;
	this.c = 0 ;
	this.d = 1 ;
                    return this;
                },
                rotation(a){
	this.a = Math.cos(a);
	this.b = Math.sin(a);
	this.c = -Math.sin(a);
	this.d = Math.cos(a);
                    return this;
                },                
                multiplyVertex(p){
	let x = p.x * this.a + p.y * this.c;
	let y = p.x * this.b + p.y * this.d;
	return {x:x , y:y};
                }                
            }
            
            
d3.selectAll('svg').attr('width',WIDTH).attr('height',HEIGHT)
            Human.Mouse.setup();
            Human.Matrix.setup();
            new Human(0);