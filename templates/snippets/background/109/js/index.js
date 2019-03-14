// JS Port of PlusParticle
// k3lab ( http://wonderfl.net/user/k3lab )
// http://wa.zozuar.org/code.php?c=hEiW
"use strict";
///////////////// Texture /////////////////////
const dot = {
	init() {
		// draw the "+" (canvas image)
		const dot = document.createElement("canvas");
		dot.width = 256;
		dot.height = 256;
		const ctx = dot.getContext("2d");
		ctx.globalCompositeOperation = "xor";
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 128 - 15, 256, 30);
		ctx.fillRect(128 - 15, 0, 30, 256);
		// create POT texture
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, dot);
		gl.generateMipmap(gl.TEXTURE_2D);
		// Mat4 transform matrix
		this.umatrix = gl.getUniformLocation(canvas.program, "uMatrix");
		this.matrix = new Float32Array(9);
	},
	// draw Image
	drawImage(x, y, width, height, cos, sin, zIndex) {
		this.matrix[0] = width  *  cos;
		this.matrix[1] = height *  sin;
		this.matrix[3] = width  * -sin;
		this.matrix[4] = height *  cos;
		this.matrix[6] = x;
		this.matrix[7] = y;
		this.matrix[8] = -zIndex;
		gl.uniformMatrix3fv(this.umatrix, false, this.matrix);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}
};
///////////////// webGL 2D canvas /////////////
const canvas = {
	init() {
		this.elem = document.querySelector("canvas");
		const options = { alpha: true, antialias: true };
		const gl = (this.gl =
			this.elem.getContext("webgl", options) ||
			this.elem.getContext("experimental-webgl", options));
		// 2D shaders
		const vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertexShader, `
			precision highp float;
			attribute vec3 aPosition;
			uniform mat3 uMatrix;
			uniform vec2 uResolution;
			varying vec2 vTexcoord;
			void main() {
				vec3 pos = uMatrix * aPosition;
				gl_Position = vec4((pos.xy / uResolution * 2.0) - 1.0, uMatrix[2][2] * 0.001, 1.0);
				vTexcoord = aPosition.xy + 0.5;
			}
		`);
		const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader, `
			precision highp float;
			varying vec2 vTexcoord;
			uniform sampler2D texture;
			void main() {
   			vec4 color = texture2D(texture, vTexcoord);
				if (color.a == 0.0) {
					discard; // don't draw if transparent
				}
				gl_FragColor = color;
			}
		`);
		// compile shaders
		gl.compileShader(vertexShader);
		gl.compileShader(fragmentShader);
		const program = (this.program = gl.createProgram());
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		// buffers
		const position = gl.getAttribLocation(program, "aPosition");
		gl.enableVertexAttribArray(position);
		this.uResolution = gl.getUniformLocation(program, "uResolution");
		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-0.5, -0.5, 1, -0.5, 0.5, 1, 0.5, -0.5, 1, 0.5, -0.5, 1, -0.5, 0.5, 1, 0.5, 0.5, 1]),
			gl.STATIC_DRAW
		);
		gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
		// combining transparency AND depth testing
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.useProgram(program);
		// window resize
		this.resize();
		window.addEventListener("resize", () => this.resize(), false);
		return gl;
	},
	resize() {
		this.width = this.elem.width = this.elem.offsetWidth;
		this.height = this.elem.height = this.elem.offsetHeight;
		this.gl.uniform2f(this.uResolution, this.width, this.height);
		this.gl.viewport(
			0,
			0,
			this.gl.drawingBufferWidth,
			this.gl.drawingBufferHeight
		);
	}
};
////////////////////////////////////////////
const count = 4000;
const degree = 2 * Math.PI / count;
const gl = canvas.init();
///////////// main loop ////////////////////
const run = time => {
	requestAnimationFrame(run);
	const horizontal = Math.sin(time / 2000) * 2;
	const vertical = Math.sin(time / 30000);
	const cosY = Math.cos(horizontal);
	const sinY = Math.sin(horizontal);
	const cosX = Math.cos(vertical);
	const sinX = Math.sin(vertical);
	const s = 2500 + 1500 * Math.sin(time / 1000);
	const a = s * 2 / count;
	const round = degree * 2 * Math.sin(time / 10000);
	const w = canvas.width;
	const h = canvas.height;
	for (let i = 0; i < count; i++) {
		const size = s * Math.sin(time / 10000 + i / 10);
		const radius = size * Math.sin(degree / 2 * i);
		const ar = round * i + time / 1000;
		const dx = Math.sin(ar);
		const dy = Math.cos(ar);
		const x = radius * dx;
		const y = radius * dy;
		const z = -s + i * a;
		const z1 = z * cosY + x * sinY;
		const z2 = z1 * cosX + y * sinX;
		if (z2 > -600) {
			const perspective = 300 / (600 + z2);
			const posx = w * 0.5 + (x * cosY - z * sinY) * perspective;
			const posy = h * 0.5 + (y * cosX - z1 * sinX) * perspective;
			let wi = (z2 - 600) * -0.1;
			if (wi < 8) wi = 8;
			if (posx > -wi && posx < w + wi && posy > -wi && posy < h + wi) {
				dot.drawImage(
					posx, // pos x
					posy, // pos y
					wi, // width
					wi, // height
					dx, // cos
					dy, // sin
					perspective // z-index
				);
			}
		}
	}
};
// start
dot.init();
run();