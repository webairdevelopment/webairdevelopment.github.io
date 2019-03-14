"use strict";
{
	const canvas = {
		init() {
			// create webGL context
			this.elem = document.querySelector("canvas");
			const gl = this.elem.getContext("webgl", { alpha: false });
			const vertexShader = gl.createShader(gl.VERTEX_SHADER);
			const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(vertexShader,	`
				uniform mat4 camProj, camView;
				uniform vec2 blocPosition;
				attribute vec3 aPosition, aNormal;
				varying lowp vec3 vColor;
				const vec3 lightDir = vec3(0, 1, -2);
				const vec3 lightColor = vec3(0.25, 0.15, 0.05);
				const vec3 ambientColor = vec3(0.1, 0.05, 0.0);
				void main(void) {
					vec4 mpos = vec4(aPosition.x + blocPosition.x, aPosition.y, aPosition.z + blocPosition.y, 1.0);
					vec3 normal = mat3(camView) * aNormal;
					float dist = 0.1 * dot(mpos, mpos);
					vColor = dist + lightColor * dot(lightDir, normal) + ambientColor;
					gl_Position = camProj * camView * mpos;
				}
			`
			);
			gl.shaderSource(fragmentShader,	`
				precision highp float;
				uniform float uTime;
				uniform vec2 uResolution;
				varying vec3 vColor;
				void main(void) {
					vec2 uv = gl_FragCoord.xy / uResolution;
					float x = (9.0 + uv.x) * uv.y * uTime;
					float grain = (mod((mod(x, 13.0) + 1.0) * (mod(x, 123.0) + 1.0), 0.01) - 0.005) * 20.0;
					gl_FragColor = vec4(vColor + grain, 1.0);
				}
			`
			);
			gl.compileShader(vertexShader);
			gl.compileShader(fragmentShader);
			this.program = gl.createProgram();
			gl.attachShader(this.program, vertexShader);
			gl.attachShader(this.program, fragmentShader);
			gl.linkProgram(this.program);
			gl.useProgram(this.program);
			return gl;
		},
		resize() {
			this.width = this.elem.width = this.elem.offsetWidth;
			this.height = this.elem.height = this.elem.offsetHeight;
			this.uResolution.set(this.width, this.height);
			camera.proj.perspective(90, this.width / this.height).load();
			gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
		}
	};
	//////// uniforms /////////
	const Float = class {
		constructor(program, uName, v = 0.0) {
			this.value = v;
			this.u = gl.getUniformLocation(program, uName);
		}
		set(v) {
			this.value = v;
			gl.uniform1f(this.u, v);
		}
	};
	const Vec2 = class {
		constructor(program, uName, x = 0.0, y = 0.0) {
			this.x = x;
			this.y = y;
			this.u = gl.getUniformLocation(program, uName);
		}
		set(x, y) {
			this.x = x;
			this.y = y;
			gl.uniform2f(this.u, x, y);
		}
	}
	const Mat4 = class {
		constructor(program, uName) {
			this.u = gl.getUniformLocation(program, uName);
			this.data = new Float32Array([
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			]);
		}
		identity() {
			const d = this.data;
			d[0] = 1;
			d[1] = 0;
			d[2] = 0;
			d[3] = 0;
			d[4] = 0;
			d[5] = 1;
			d[6] = 0;
			d[7] = 0;
			d[8] = 0;
			d[9] = 0;
			d[10] = 1;
			d[11] = 0;
			d[12] = 0;
			d[13] = 0;
			d[14] = 0;
			d[15] = 1;
			return this;
		}
		translate(x, y, z) {
			const d = this.data;
			d[12] = d[0] * x + d[4] * y + d[8] * z + d[12];
			d[13] = d[1] * x + d[5] * y + d[9] * z + d[13];
			d[14] = d[2] * x + d[6] * y + d[10] * z + d[14];
			d[15] = d[3] * x + d[7] * y + d[11] * z + d[15];
			return this;
		}
		rotateX(angle) {
			const d = this.data;
			const s = Math.sin(angle);
			const c = Math.cos(angle);
			const a10 = d[4];
			const a11 = d[5];
			const a12 = d[6];
			const a13 = d[7];
			const a20 = d[8];
			const a21 = d[9];
			const a22 = d[10];
			const a23 = d[11];
			d[4] = a10 * c + a20 * s;
			d[5] = a11 * c + a21 * s;
			d[6] = a12 * c + a22 * s;
			d[7] = a13 * c + a23 * s;
			d[8] = a10 * -s + a20 * c;
			d[9] = a11 * -s + a21 * c;
			d[10] = a12 * -s + a22 * c;
			d[11] = a13 * -s + a23 * c;
			return this;
		}
		rotateY(angle) {
			const d = this.data;
			const s = Math.sin(angle);
			const c = Math.cos(angle);
			const a00 = d[0];
			const a01 = d[1];
			const a02 = d[2];
			const a03 = d[3];
			const a20 = d[8];
			const a21 = d[9];
			const a22 = d[10];
			const a23 = d[11];
			d[0] = a00 * c + a20 * -s;
			d[1] = a01 * c + a21 * -s;
			d[2] = a02 * c + a22 * -s;
			d[3] = a03 * c + a23 * -s;
			d[8] = a00 * s + a20 * c;
			d[9] = a01 * s + a21 * c;
			d[10] = a02 * s + a22 * c;
			d[11] = a03 * s + a23 * c;
			return this;
		}
		perspective(fov, aspect) {
			const d = this.data;
			const near = 0.01;
			const far = 100;
			const top = near * Math.tan(fov * Math.PI / 360);
			const right = top * aspect;
			const left = -right;
			const bottom = -top;
			d[0] = 2 * near / (right - left);
			d[1] = 0;
			d[2] = 0;
			d[3] = 0;
			d[4] = 0;
			d[5] = 2 * near / (top - bottom);
			d[6] = 0;
			d[7] = 0;
			d[8] = (right + left) / (right - left);
			d[9] = (top + bottom) / (top - bottom);
			d[10] = -(far + near) / (far - near);
			d[11] = -1;
			d[12] = 0;
			d[13] = 0;
			d[14] = -(2 * far * near) / (far - near);
			d[15] = 0;
			return this;
		}
		load() {
			gl.uniformMatrix4fv(this.u, gl.FALSE, this.data);
			return this;
		}
	};
	//////////// mesh ////////////
	const geometry = () => {
		let iV = 0, iN = 0;
		const vertices = new Float32Array(89424);
		const normals = new Float32Array(89424);
		const genNormals = [];
		{
			const n = [0, 0, 1.2, 0, 0, -1.2, 0, 1.2, 0, 0, -1.2, 0, 1.2, 0, 0, -1.2, 0, 0];
			for (let i = 0; i < 6; i++) {
				for (let j = 0; j < 6; j++) {
					genNormals.push(n[i * 3], n[i * 3 + 1], n[i * 3 + 2]);
				}
			}
		}
		const concat = (a1, a2, index) => {
			for (let i = 0, l = a2.length; i < l; i++) {
				a1[index++] = a2[i];
			}
			return index;
		};
		const fractalCube = (cx, cy, cz, scale, level) => {
			if (level === 0) return;
			cube(cx, cy, cz, scale, level);
			fractalCube(cx + scale * 0.45, cy - scale * 0.45, cz + scale * 0.45, scale / 2, level - 1);
			fractalCube(cx - scale * 0.45, cy - scale * 0.45, cz + scale * 0.45, scale / 2, level - 1);
			fractalCube(cx + scale * 0.45, cy - scale * 0.45, cz - scale * 0.45, scale / 2, level - 1);
			fractalCube(cx - scale * 0.45, cy - scale * 0.45, cz - scale * 0.45, scale / 2, level - 1);
		}
		const cube = (cx, cy, cz, scale, level) => {
			const h = level === 1 ? 2 : 0.7;
			const y = level === 1 ? -0.5 : 0;
			const structure = [
				[-0.425, y, -0.425, 0.15, h, 0.15],
				[-0.425, y, 0.425, 0.15, h, 0.15],
				[0.425, y, -0.425, 0.15, h, 0.15],
				[0.425, y, 0.425, 0.15, h, 0.15],
				[-0.425, 0.425, 0, 0.15, 0.15, 1],
				[0.425, 0.425, 0, 0.15, 0.15, 1],
				[0, 0.425, -0.425, 0.7, 0.15, 0.15],
				[0, 0.425, 0.425, 0.7, 0.15, 0.15]
			];
			if (level > 1) {
				structure.push(
					[-0.425, -0.425, 0, 0.15, 0.15, 1],
					[0.425, -0.425, 0, 0.15, 0.15, 1],
					[0, -0.425, -0.425, 1, 0.15, 0.15],
					[0, -0.425, 0.425, 1, 0.15, 0.15]
				);
			} else {
				structure.push(
					[0, -2, 0, 2, 0.01, 2]
				);
			}
			for (const c of structure) {
				iV = concat(vertices, genVertices(
					cx + c[0] * scale,
					cy + c[1] * scale,
					cz + c[2] * scale,
					c[3] * scale / 2,
					c[4] * scale / 2,
					c[5] * scale / 2
				), iV);
				iN = concat(normals, genNormals, iN);
			}
		};
		const genVertices = (x, y, z, l, h, w) => {
			return [
				x-l,y-h,z+w,x+l,y-h,z+w,x+l,y+h,z+w,x-l,y-h,z+w,x+l,y+h,z+w,x-l,y+h,z+w,// Front face
				x-l,y-h,z-w,x-l,y+h,z-w,x+l,y+h,z-w,x-l,y-h,z-w,x+l,y+h,z-w,x+l,y-h,z-w,// Back face
				x-l,y+h,z-w,x-l,y+h,z+w,x+l,y+h,z+w,x-l,y+h,z-w,x+l,y+h,z+w,x+l,y+h,z-w,// Top face
				x-l,y-h,z-w,x+l,y-h,z-w,x+l,y-h,z+w,x-l,y-h,z-w,x+l,y-h,z+w,x-l,y-h,z+w,// Bottom face
				x+l,y-h,z-w,x+l,y+h,z-w,x+l,y+h,z+w,x+l,y-h,z-w,x+l,y+h,z+w,x+l,y-h,z+w,// Right face
				x-l,y-h,z-w,x-l,y-h,z+w,x-l,y+h,z+w,x-l,y-h,z-w,x-l,y+h,z+w,x-l,y+h,z-w // Left face
			];
		};
		// def buffers
		const attribute = (program, name, data, size) => {
			const index = gl.getAttribLocation(program, name);
			gl.enableVertexAttribArray(index);
			const buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.vertexAttribPointer(index, size, gl.FLOAT, false, 0, 0);
			gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
		};
		// build
		fractalCube(0, 0, 0, 1, 4);
		attribute(canvas.program, "aPosition", vertices, 3);
		attribute(canvas.program, "aNormal", normals, 3);
		return normals.length / 3;
	};
	////////// bloc ////////////
	const Block = class {
		constructor(x, z) {
			this.position = new Vec2(canvas.program, "blocPosition", x, z);
			this.numElements = numElements;
		}
		draw(dt) {
			this.position.set(this.position.x, this.position.y + dt);
			gl.drawArrays(gl.TRIANGLES, 0, this.numElements);
			if (this.position.y > 5.4) this.position.y -= 6 * 1.8;
		}
	};
	///////////// init //////////////
	const gl = canvas.init();
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	const camera = {
		proj: new Mat4(canvas.program, "camProj").load(),
		view: new Mat4(canvas.program, "camView").load()
	};
	let uTime = new Float(canvas.program, "uTime", 0);
	canvas.uResolution = new Vec2(canvas.program, "uResolution");
	canvas.resize();
	window.addEventListener("resize", () => canvas.resize(), false);
	///////// generate structure ////////
	const blocs = [];
	const numElements = geometry();
	for (let x = -2; x <= 2; x++) {
		for (let z = -5; z <= 0; z++) {
			const b = new Block(x * 1.8, 1.8 + z * 1.8);
			blocs.push(b);
		}
	}
	///////// pointer ///////////
	const pointer = {
		isDown: false,
		move(e, touch) {
			if (touch === true) {
				e.preventDefault();
				this.x = e.targetTouches[0].clientX;
				this.y = e.targetTouches[0].clientY;
			} else {
				this.x = e.clientX;
				this.y = e.clientY;
			}
		},
		down(e, touch) {
			this.move(e, touch);
			this.isDown = true;
			this.xb = this.x;
			this.yb = this.y;
			canvas.elem.style.cursor = "move";
		},
		up(e) {
			this.isDown = false;
			canvas.elem.style.cursor = "pointer";
		},
		init(canvas) {
			this.x = canvas.width * 0.5;
			this.y = canvas.height * 0.5;
			this.cx = this.xb = this.ex = 0;
			this.cy = this.yb = this.ey = 0;
			window.addEventListener("mousemove", e => this.move(e, false), false);
			canvas.elem.addEventListener("touchmove", e => this.move(e, true), false);
			window.addEventListener("mousedown", e => this.down(e, false), false);
			window.addEventListener("touchstart", e => this.down(e, true), false);
			window.addEventListener("mouseup", e => this.up(e), false);
			window.addEventListener("touchend", e => this.up(e), false);
		},
		rotate() {
			if (this.isDown) {
				this.cx += (this.x - this.xb) / 200;
				this.cy += (this.y - this.yb) / 200;
			} else {
				this.cx *= 0.995;
				this.cy *= 0.995;
			}
			this.xb = this.x;
			this.yb = this.y;
			this.ex += (this.cx - this.ex) * 0.01;
			this.ey += (this.cy - this.ey) * 0.01;
		}
	};
	pointer.init(canvas);
	///////// main loop /////////
	let ry = 0, time = 0, dt = 0.0027;
	const run = (newTime) => {
		requestAnimationFrame(run);
		// delta time
		let d = 0.0002 * (newTime - time);
		if (d > 0.1) d = 0.1;
		dt += (d - dt) * 0.01;
		time = newTime;
		// clear screen
		gl.clearColor(1, 1, 1, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		// move camera
		uTime.set(time);
		pointer.rotate();
		camera.view
			.identity()
			.rotateY(0.75 * Math.sin(ry += dt))
			.rotateX(pointer.ey + Math.PI / 8)
			.translate(0, -0.25 + 1 * Math.cos(ry), 0)
			.rotateY(pointer.ex)
			.load();
		// draw blocs
		for (const bloc of blocs) bloc.draw(dt);
	};
	// start
	requestAnimationFrame(run);
}