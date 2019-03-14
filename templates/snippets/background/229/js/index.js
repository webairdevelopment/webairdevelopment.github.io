"use strict";
// tutorial: https://gamedevelopment.tutsplus.com/tutorials/a-beginners-guide-to-coding-graphics-shaders-part-3--cms-24351
{
	const canvas = {
		init(img) {
			this.elem = document.querySelector("canvas");
			const gl = this.elem.getContext("webgl", { alpha: false });
			const vertexShader = gl.createShader(gl.VERTEX_SHADER);
			const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(vertexShader,	`
				attribute vec2 aPosition;
				void main() {
					gl_Position = vec4(aPosition * 2.0 - 1.0, 0, 1);
				}
			`);
			gl.shaderSource(fragmentShader,	`
				precision highp float;
				uniform sampler2D normalmap;
				uniform vec2 uResolution;
				uniform vec2 uPointer;
				void main() {
					vec2 pixel = gl_FragCoord.xy / uResolution.xy;
					vec4 normalVector = texture2D(normalmap, pixel);
					normalVector.xy -= 0.5;
					vec3 NormalVector = normalize(normalVector.xyz);
					vec2 lightPosition = uPointer.xy / uResolution.xy;
					lightPosition.y = 1.0 - lightPosition.y;
					float aspect = uResolution.y / uResolution.x;
					vec3 LightVector = normalize(vec3(lightPosition.x - pixel.x, (pixel.y - lightPosition.y) * aspect, 0.15));
					float diffuse = 2.5 * max(dot(NormalVector, LightVector), 0.0);
					gl_FragColor = 0.4 * vec4(0.5, 0.4, 0.25, 1) * diffuse * diffuse;
				}
			`);
			gl.compileShader(vertexShader);
			gl.compileShader(fragmentShader);
			this.program = gl.createProgram();
			gl.attachShader(this.program, vertexShader);
			gl.attachShader(this.program, fragmentShader);
			gl.linkProgram(this.program);
			gl.useProgram(this.program);
			const aPosition = gl.getAttribLocation(this.program, "aPosition");
			const posBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]), gl.STATIC_DRAW);
			const texture = gl.createTexture();
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
			this.uResolution = gl.getUniformLocation(this.program, "uResolution");
			this.uPointer = gl.getUniformLocation(this.program, "uPointer");
			gl.enableVertexAttribArray(aPosition);
			gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
			return gl;
		},
		resize() {
			this.width = this.elem.width = this.elem.offsetWidth;
			this.height = this.elem.height = this.elem.offsetHeight;
			this.left = this.elem.offsetLeft;
			this.top = this.elem.offsetTop;
			gl.uniform2f(this.uResolution, this.width, this.height);
			gl.viewport(0, 0, this.width, this.height);
		}
	};
	const pointer = {
		init(canvas) {
			this.x = canvas.width * 0.8;
			this.y = canvas.height * 0.25;
			["mousemove", "touchstart", "touchmove"].forEach((event, touch) => {
				canvas.elem.addEventListener(event,
					e => {
						if (touch) {
							e.preventDefault();
							this.x = e.targetTouches[0].clientX - canvas.left;
							this.y = e.targetTouches[0].clientY - canvas.top;
						} else {
							this.x = e.clientX - canvas.left;
							this.y = e.clientY - canvas.top;
						}
					},
					false
				);
			});
		}
	};
	const run = () => {
		requestAnimationFrame(run);
		gl.uniform2f(canvas.uPointer, pointer.x, pointer.y);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	};
	/////////////////////////////////////////////////////////////
	const gl = canvas.init(document.getElementById("normalmap"));
	canvas.resize();
	window.addEventListener("resize", () => canvas.resize(), false);
	pointer.init(canvas);
	run();
}