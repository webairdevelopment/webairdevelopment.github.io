var canvas,ctx,tx,ty,N,pr;

(function(){
    var a,b;
    canvas = document.getElementsByTagName('canvas')[0];
    ctx = canvas.getContext('2d');
    canvas.width=canvas.height=400;
    a=Object.getOwnPropertyNames(Math);
    for(b=0;b<a.length;b++)window[a[b]]=Math[a[b]];
    tx=canvas.width/2;
    ty=canvas.height/2;
    aaa();
})();

function aaa(){
    var a,b,c,d,x,y,x1,y1,r,r1,tim,n,han,kan,t,len;
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#000";
    tim=new Date().getTime()/100;
    N=7;
    n=tim/500;
    han=10+ran()*5;
    kan=(N+1)*han;
    t=(tim/73+ran()/5)%1;
    len=3;
    r=tim/211;
    gru(tx,ty,han,r+t*PI*2);
    
    for(a=0;a<len;a++){
        x=cos(r);
        y=sin(r);
        b=(1-t+a/len)%1;
        b=pow(N,b)*han;
        x1=tx+x*kan;
        y1=ty+y*kan;
        pr=-0.11*sin(tim/49);
        c=hag(x1,y1,han,[tx+x*b,ty+y*b]);
        r1=r;
        for(d=2;d<7;d++){
            r1+=pr*PI*2;
            x1+=cos(r1)*kan;
            y1+=sin(r1)*kan;
            c=hag(x1,y1,han,c);
            pr*=0.88;
        }
        r+=PI*2/len;
    }
    
    function ran(){
        var a;
        n++;
        a=sin(n*3)+sin(n*7)+sin(n*19)+sin(n*43);
        a=a/8+0.5;
        
        return a;
    }
    requestAnimationFrame(aaa);
}

function hag(tx,ty,s,tp){
    var a,b,x,y,r,px,py,r0,ky;
    x=tp[0]-tx;
    y=tp[1]-ty;
    ky=sqrt(x*x+y*y);
    r0=r=atan2(y,x);
    px=cos(r+pr*PI*2);
    py=sin(r+pr*PI*2);
    b=ky/s;
    if(b)b=log(b)/log(N);
    r=-PI*b*2+r;
    
    gru(tx,ty,s,r);
    
    a=(r-r0)/(PI*2);
    a=(-a+0.5+pr+100)%1;
    a=pow(N,a)*s;
    a=[tx-a*px,ty-a*py];
    return a;
}

function gru(tx,ty,s,r){
    var a,b,c,d,max,x,y,nm,p;
    max=1000;
    nm=11;
    
    p=[];
    for(a=0;a<max;a++){
        d=a/(max-1);
        b=pow(N,d);
        c=sin(b*nm);
        b+=c/2;
        x=cos(r)*s*b;
        y=sin(r)*s*b;
        p.push([tx+x,ty+y]);
        r+=PI*2/max;
    }
    
    ctx.beginPath();
    for(a=0;a<max;a++){
        b=p[a];
        ctx.lineTo(b[0],b[1]);
    }
    
    a=p[0];
    b=p[p.length-1];
    toarc(b[0],b[1],a[0],a[1],1,1);
    ctx.fill();
}

function toarc(sx,sy,ex,ey,kaku,gya){
    var a,b,c,d,x,y,x1,y1,r,han,kyo,rx,ry,sk,ek,haba,tx,ty,max;
    
    x=ex-sx;
    y=ey-sy;
    r=Math.atan2(y,x);
    if(gya)r+=Math.PI;
    kaku=Math.PI*2-kaku;
    
    rx=sx+x/2;ry=sy+y/2;
    han=Math.pow(x*x+y*y,0.5)/Math.sin(kaku/2)/2;
    kyo=Math.cos(kaku/2)*han;
    x=Math.sin(r)*kyo;y=-Math.cos(r)*kyo;
    tx=rx+x;ty=ry+y;
    ek=r-kaku/2+Math.PI/2;sk=ek+kaku;
    haba=han/20;
    
    if(gya){
        a=sk;sk=ek;ek=a;
    }
    ctx.arc(tx,ty,han,sk,ek,gya);
}