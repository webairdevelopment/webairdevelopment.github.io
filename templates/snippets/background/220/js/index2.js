    precision mediump float;
		uniform float time;
		uniform vec2 resolution;
    uniform bool isMouseInteraction;
		uniform vec2 mouse;
		
		vec2 random2( vec2 p ) {
			return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
		}

		void main() {
			float shortSide = min(resolution.x, resolution.y);
			vec2 pixelPos = (gl_FragCoord.xy * 2.0 - resolution) / shortSide;
			vec2 mousePos = ((mouse * 2.0 - resolution) / shortSide);
			mousePos.y *= -1.0;

			float toMouseDistance = distance(mousePos.xy, pixelPos.xy);
      
      if(isMouseInteraction) {
				pixelPos *= 3.0;
				pixelPos *= toMouseDistance;
			} else {
				pixelPos *= 7.0;
			}
			
			vec3 color = vec3(0.0);

			vec2 cellIndex = floor(pixelPos);
			vec2 cellLocalPos = fract(pixelPos);

			float minDist = 1.0;
			vec2 nearestPoint;

			for(int y = -1; y <= 1; y++) {
				for(int x = -1; x <= 1; x++) {
					vec2 neighbor = vec2(float(x), float(y));
					vec2 point = random2(cellIndex + neighbor);
					point = 0.5 + 0.5 * sin(time + 6.2831 * point);
					vec2 diff = point + neighbor - cellLocalPos;
					float dist = length(diff);
					if (dist < minDist) {
						minDist = dist;
						nearestPoint = point;
					}
				}
			}

			color += minDist * 2.0;
			color.rg = nearestPoint;
			color -= abs(sin(4.0 * minDist)) * 0.4;
			color += 1.0 - step(0.03, minDist);

			gl_FragColor = vec4(color, 1.0);
		}
