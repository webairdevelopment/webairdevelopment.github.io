precision mediump float;
precision mediump int;
uniform float time;
varying vec3 vPosition;
varying vec4 vColor;
void main(){
  vec4 color = vec4( vColor.rgb,0.4 );
  color.r = 0.98754;
  color.g = 0.253;
  color.b = 0.1;
  color.a += sin( vPosition.x * 2.0 + time );
  gl_FragColor = sin(color);
}
