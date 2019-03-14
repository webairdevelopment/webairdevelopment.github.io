var canvas,ctx,gtx,gty,gen,N,syu,mp,gp,t1,t2;

(function(){
    var a,b;
    canvas = document.getElementsByTagName('canvas')[0];
    ctx = canvas.getContext('2d');
    canvas.width=canvas.height=400;
    a=Object.getOwnPropertyNames(Math);
    for(b=0;b<a.length;b++)window[a[b]]=Math[a[b]];
    aaa();
})();



function aaa(){
    var a,b,c;
    ctx.fillStyle="rgb(255,255,255)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    tim=new Date().getTime()/800;
    gtx=canvas.width/2;
    gty=canvas.height/2;
    
    ctx.fillStyle="#000";
    N=3.3+ran(tim/49)*2;
    syu=5;
    a=tim/2+ran(tim/30)*2;
    t1=(a)%1;
    t2=1-t1;
    a=a|0;
    b=1;
    if(a%2==1)b=-1;
    
    gen=5;
    mp=[];
    uzu(0,0,100,0,b,a,0);
    
    a=mp[2];
    b=mp[3];
    gp=getp(a,b,t1);
    
    r1=a[3];
    r2=b[3];
    
    b=r2-r1;
    
    if(abs(b)>=PI){
        if(b>0){
            gp[3]=r1*t2+(r2-PI*2)*t1;
        }else{
            gp[3]=r1*t2+(r2+PI*2)*t1;
        }
    }
    
    ctx.save();
    ctx.translate(gtx,gty);
    ctx.rotate((-gp[3]+tim/50+ran(tim/29)*2)%(PI*2));
    ctx.translate(-gtx,-gty);
    for(a=0;a<mp.length;a++){
        b=mp[a];
        maki(b[0],b[1],b[2],b[3],b[4]);
    }
    ctx.restore();
    requestAnimationFrame(aaa);
}

function ran(n){
    var a;
    a=sin(n*3)+sin(n*7)+sin(n*19)+sin(n*43);
    a=a/8+0.5;
    return a;
}

function maki(tx,ty,s,r0,h){
    var a,b,c,d,e,r,r1,x1,y1,x,y,max,han,p,q,bai;
    
    tx-=gp[0];
    ty-=gp[1];
    bai=100/gp[2];
    tx=tx*bai;
    ty=ty*bai;
    s*=bai;
    c=sqrt(tx*tx+ty*ty);
    if(c>300+s)return;
    tx+=gtx;
    ty+=gty;
    max=(s*4+10)|0;
    han=s/pow(N,syu);
    p=[];
    q=[];
    
    for(a=0;a<max;a++){
        b=a/(max-1);
        c=pow(N,b*syu)*han;
        r=b*PI*2*syu*h+r0;
        d=c*1.1;
        e=c*0.9;
        x=cos(r);
        y=sin(r);
        p.push([tx+x*d,ty+y*d]);
        q.push([tx+x*e,ty+y*e]);
    }
    
    ctx.beginPath();
    for(a=0;a<p.length;a++)ctx.lineTo(p[a][0],p[a][1]);
    for(a=q.length-1;a>=0;a--)ctx.lineTo(q[a][0],q[a][1]);
    ctx.fill();
}

function getp(a,b,c){
    var x,y,d,e;
    if(c===undefined)c=0.5;
    e=[];
    for(d=0;d<a.length;d++){
        e.push((b[d]-a[d])*c+a[d]);
    }
    return e;
}

function uzu(tx,ty,s,r0,h,sd,kai){
    var a,b,c,r,x1,y1,x,y,max,han;
    if(kai>gen)return;
    han=s/pow(N,syu);
    mp.push([tx,ty,s,r0%(PI*2),h]);
    
    for(a=0;a<4;a++){
        b=0.91-a*0.04+ran(sd-tim/13)*0.03;
        c=pow(N,b*syu)*han;
        r=b*PI*2*syu*h+r0;
        x=cos(r)*c+tx;
        y=sin(r)*c+ty;
        c*=1+ran(sd%6+tim/27)*0.1;
        if(kai==gen-1)c*=t1;
        x1=cos(r)*c;
        y1=sin(r)*c;
        uzu(x+x1,y+y1,c,r+PI,h*-1,sd+pow(100,a),kai+1);
    }
}