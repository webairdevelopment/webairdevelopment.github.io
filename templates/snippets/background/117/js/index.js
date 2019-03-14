const regl = createREGL();
const draw = regl({
  frag: `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
    #else
      precision mediump float;
    #endif
    
//Julia set for f(z)=(z^2+a)/(bz^2+1)

vec2 mul(vec2 a, vec2 b){
  return vec2(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x) ;
}

vec2 div (vec2 a, vec2 b){
  float bb = dot(b,b) ;
  return vec2((a.x*b.x+a.y*b.y)/bb,(a.y*b.x-a.x*b.y)/bb) ;
}

float julia(vec2 z, vec2 a, vec2 b) {
      for(float i = 0.0; i < 20.; i++) {
        float xx = z.x*z.x, yy = z.y*z.y, zz = xx + yy;
        if (zz > 100.0){return 100.0;}
        if(zz > 10.0) { return i - log2(log2(zz)) + 4.0;}
        //if (zz>200.0) { return 200.0 ;} 
        //if (zz>150.0) { return 150.0 ;}
        vec2 z2=vec2(z.x*z.x-z.y*z.y,2.0*z.x*z.y) ;
        vec2 z2pa=z2 + a ;
        vec2 bz2p1=mul(b,z2)+vec2(1.,0.) ;
        z = div(z2pa,bz2p1);
      }
      return 0.0 ;
    }
    
    uniform vec2 c;
    // const vec2 a = vec2(0.5,0.) ;
    // const vec2 b = vec2(-1.6,0.) ;
    // const vec2 a = vec2(0.59,0.65) ;
    // const vec2 b = vec2(-1.35,-0.46) ;
    vec2 a = vec2(0.1965,0.0) ;    // (1.,24./10.)(-1.,0.0)
    vec2 b = vec2(-1.0,0.0) ;

    varying vec2 z;
    void main() {
      float m = julia(z, c, b);
      vec3 rgb = 0.5 + 0.5*cos(3.0 + 0.15*m + vec3(0.0, 0.6, 1.0));
      gl_FragColor = vec4(rgb, 1.0);
    }
  `,
  vert: `
    attribute vec2 position;
    uniform mat2 transform;
    varying vec2 z;
    void main() {
      z = transform * position;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `,
  uniforms: {
    transform: ({ viewportWidth: w, viewportHeight: h }) => {
      return mat2.fromScaling([], [2*w/h, 2]);
    },
    c: ({ time: t }) => {
      const a = [1.1, 0.0];
      const b = [-Math.cos(0.05*t), 0*Math.sin(0.05*t)];
      return vec2.scaleAndAdd([], a, b, 0.91);
      // const a = [.186, 0];
      // const b = [-Math.cos(0.5*t), 0*Math.sin(0.05*t)];
      // return vec2.scaleAndAdd([], a, b, 0.001);
    }
  },
  attributes: {
    position: [1, 1, -1, 1, 1, -1, -1, -1]
  },
  primitive: 'triangle strip',
  count: 4
});

regl.frame(draw);