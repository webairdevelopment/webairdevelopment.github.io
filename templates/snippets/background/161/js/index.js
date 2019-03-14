"use strict";
{
	////////////////////////////////////////////////////////////////
	const canvas = {
		init() {
			this.elem = document.querySelector("canvas");
			const gl = this.elem.getContext("webgl", { alpha: false });
			const vertexShader = gl.createShader(gl.VERTEX_SHADER);
			const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(vertexShader,	`
				uniform mat4 camProj, camView;
				attribute vec3 aPosition, aNormal;
				varying vec3 vColor;
				const vec3 lightDir = vec3(0, 1, 0);
				const vec3 lightColor = 1.0 * vec3(0.35, 0.33, 0.3);
				void main(void) {
					vec3 normal = mat3(camView) * aNormal;
					vec4 pos = camView * vec4(aPosition, 1.0);
					vColor = (lightColor * dot(normal, lightDir) + 0.3 * aPosition.y - 0.5);
					vColor = mix(vColor, vec3(-1.2 * pos.y, -1.0 * pos.y, -0.8 * pos.y), 0.08);
					gl_Position = camProj * pos; 
				}
			`
			);
			gl.shaderSource(fragmentShader,	`
				precision highp float;
				varying vec3 vColor;
				void main(void) {
					gl_FragColor = vec4(vColor, 1.0);
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
			camera.proj.perspective(60, this.width / this.height).load();
			gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
		}
	};
	////////////////////////////////////////////////////////////////
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
			const near = 0.02;
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
	////////////////////////////////////////////////////////////////
	const gl = canvas.init();
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	const camera = {
		proj: new Mat4(canvas.program, "camProj").load(),
		view: new Mat4(canvas.program, "camView").load()
	};
	canvas.resize();
	window.addEventListener("resize", () => canvas.resize(), false);
	////////////////////////////////////////////////////////////////
	const decodeHeightMap = () => {
		const width = 512;
		const height = 512;
		const img = document.getElementById("heightmap");
		const cmap = document.createElement("canvas");
		cmap.width = width;
		cmap.height = height;
		const cty = cmap.getContext("2d");
		cty.drawImage(img, 0, 0);
		const hmap = cty.getImageData(0, 0, width, height).data;
		const readPixel = (x, y) => hmap[(y * width + x) * 4];
		const freePixel = (x, y) => hmap[(y * width + x) * 4 + 3] !== 0;
		const Rect = class {
			constructor(x, y, w, h) {
				this.x = x;
				this.y = y;
				this.w = w;
				this.h = h;
				this.c = readPixel(x, y);
			}
			draw() {
				for (let x = this.x; x < this.x + this.w; x++) {
					for (let y = this.y; y < this.y + this.h; y++) {
						hmap[(y * width + x) * 4 + 3] = 0;
					}
				}
				if (this.c > 32) iV = concat(vertices, cube(
					(this.x - width * 0.5) * 0.1, 
					(this.y - height * 0.5) * 0.1, 
					this.w * 0.1, 
					this.c * 0.025, 
					this.h * 0.1
				), iV);
			}
			grow() {
				let w = this.w;
				let h = this.h;
				let s = true;
				do {
					w++;
					h++;
					s = this.sameColorV(this.x, this.y, w, h) && this.sameColorH(this.x, this.y, w, h);
				} while (s);
				w--;
				h--;
				const c1 = readPixel(this.x, this.y + h);
				if (this.c === c1 && freePixel(this.x, this.y + h) === true) {
					do {
						h++;
						s = this.sameColorV(this.x, this.y, w, h);
					} while (s);
					h--;
				} else {
					const c1 = readPixel(this.x + w, this.y);
					if (this.c === c1 && freePixel(this.x + w, this.y) === true) {
						do {
							w++;
							s = this.sameColorH(this.x, this.y, w, h);
						} while (s);
						w--;
					}
				}
				this.w = w;
				this.h = h;
			}
			sameColorV(x0, y0, w, h) {
				const c0 = readPixel(x0, y0);
				for (let x = x0; x < x0 + w; x++) {
					const c = readPixel(x, y0 + h - 1);
					if (c !== c0 || freePixel(x, y0 + h - 1) === false) return false;
				}
				return true;
			}
			sameColorH(x0, y0, w, h) {
				const c0 = readPixel(x0, y0);
				for (let y = y0; y < y0 + h; y++) {
					const c = readPixel(x0 + w - 1, y);
					if (c !== c0 || freePixel(x0 + w - 1, y) === false) return false;
				}	
				return true;
			}
		};
		const vertices = new Float32Array(2000000);
		let iV = 0;
		const cube = (x, z, l, h, w) => [
			x,h,z,0,1,0,x,h,z+w,0,1,0,x+l,h,z+w,0,1,0,x,h,z,0,1,0,x+l,h,z+w,0,1,0,x+l,h,z,0,1,0,
			x,0,z,-1,0,0,x,0,z+w,-1,0,0,x,h,z+w,-1,0,0,x,0,z,-1,0,0,x,h,z+w,-1,0,0,x,h,z,-1,0,0,
			x+l,0,z,1,0,0,x+l,h,z,1,0,0,x+l,h,z+w,1,0,0,x+l,0,z,1,0,0,x+l,h,z+w,1,0,0,x+l,0,z+w,1,0,0,
			x,0,z,0,0,-1,x,h,z,0,0,-1,x+l,h,z,0,0,-1,x,0,z,0,0,-1,x+l,h,z,0,0,-1,x+l,0,z,0,0,-1,
			x,0,z+w,0,0,1,x+l,0,z+w,0,0,1,x+l,h,z+w,0,0,1,x,0,z+w,0,0,1,x+l,h,z+w,0,0,1,x,h,z+w,0,0,1
		];
		const attribute = (program, name, data, size, stride, offset) => {
			if (data !== null) {
				const buffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
				gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
			}
			const index = gl.getAttribLocation(program, name);
			gl.enableVertexAttribArray(index);
			gl.vertexAttribPointer(index, size, gl.FLOAT, false, stride, offset);
		};
		const concat = (a1, a2, index) => {
			for (let i = 0, l = a2.length; i < l; i++) {
				a1[index++] = a2[i];
			}
			return index;
		};
		let nr = 0;
		const heap = [[0,0]];
		do {
			const c = heap.shift();
			if (freePixel(c[0], c[1]) === true) {
				const r = new Rect(c[0], c[1], 1, 1);
				r.grow();
				r.draw();
				if (r.y + r.h < height && freePixel(r.x, r.y + r.h) === true) heap.push([r.x, r.y + r.h]);
				if (r.x + r.w < width && freePixel(r.x + r.w, r.y) === true) heap.push([r.x + r.w, r.y]);
			}
		} while (heap.length);
		attribute(canvas.program, "aPosition", vertices, 3, 24, 0);
		attribute(canvas.program, "aNormal", null, 3, 24, 12);
		return iV / 6;
	}
	let numElements = decodeHeightMap();
	////////////////////////////////////////////////////////////////
	let ry = 51.2, time = 0, dt = 0.0009;
	let rx = 0.5 * Math.PI * Math.floor(Math.random() * 4);
	const run = (newTime) => {
		requestAnimationFrame(run);
		let d = 0.001 * (newTime - time);
		if (d > 0.1) d = 0.1;
		dt += (d - dt) * 0.01;
		time = newTime;
		ry += dt;
		camera.view
			.identity()
			.rotateX(0.8)
			.translate(0.15, -11, ry % 51.2)
			.rotateY(rx)
			.load();
		gl.drawArrays(gl.TRIANGLES, 0, numElements);
		camera.view
			.identity()
			.rotateX(0.8)
			.translate(0.15, -11, -51.2 + ry % 51.2)
			.rotateY(rx)
			.load();
		gl.drawArrays(gl.TRIANGLES, 0, numElements);
	};
	requestAnimationFrame(run);
	["click", "touchdown"].forEach(event => {
		document.addEventListener(event, () => rx += Math.PI * 0.5, false);
	});
}