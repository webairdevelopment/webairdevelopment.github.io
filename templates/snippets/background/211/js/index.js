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
				varying vec3 vPos, vNormal;
				void main(void) {
					vNormal = mat3(camView) * aNormal;
					vec4 pos = camView * vec4(aPosition, 1.0);
					vPos = pos.xyz;
					gl_Position = camProj * pos; 
				}
			`);
			gl.shaderSource(fragmentShader,	`
				precision highp float;
				varying vec3 vPos, vNormal;
				const vec3 lightDir = vec3(.5, .5, .5);
				const vec3 lightPos = vec3(0, 0, -8);
				const float radius = 100.0;
				void main(void) {
					float dist = distance(vPos, lightPos);
					float att = max(1.0 - (dist * dist) / radius, 0.0);
					vec3 lightDirection = normalize(lightPos - vPos);
					vec3 normal = normalize(vNormal);
					float angle = dot(lightDirection, normal);
					vec3 diffuse = vec3(0.3, 0.4, 0.6) * dot(normal, lightDir);
					vec3 spot = vec3(2.5, 1.8, 0.8) * att * angle;					
					gl_FragColor = vec4(mix(spot, diffuse, 0.5), 1.0);
				}
			`);
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
			camera.proj.perspective(90, this.width / this.height).load();
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
			const near = 0.01;
			const far = 200;
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
	const blocks = () => {
		const width = 1024;
		const height = 1024;
		let vertices = new Float32Array(2000000);
		let iV = 0;
		const cube = (x, y, z, l, h, w) => [
			x,y,z+w,0,0,1,x+l,y,z+w,0,0,1,x+l,y+h,z+w,0,0,1,x,y,z+w,0,0,1,x+l,y+h,z+w,0,0,1,x,y+h,z+w,0,0,1,// Front face
			x,y,z,0,0,-1,x,y+h,z,0,0,-1,x+l,y+h,z,0,0,-1,x,y,z,0,0,-1,x+l,y+h,z,0,0,-1,x+l,y,z,0,0,-1,// Back face
			x,y+h,z,0,1,0,x,y+h,z+w,0,1,0,x+l,y+h,z+w,0,1,0,x,y+h,z,0,1,0,x+l,y+h,z+w,0,1,0,x+l,y+h,z,0,1,0,// Top face
			x+l,y,z,1,0,0,x+l,y+h,z,1,0,0,x+l,y+h,z+w,1,0,0,x+l,y,z,1,0,0,x+l,y+h,z+w,1,0,0,x+l,y,z+w,1,0,0,// Right face
			x,y,z,-1,0,0,x,y,z+w,-1,0,0,x,y+h,z+w,-1,0,0,x,y,z,-1,0,0,x,y+h,z+w,-1,0,0,x,y+h,z,-1,0,0 // Left face
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
		const increaseArray = (oldArray) => {
			const newArray = new Float32Array(oldArray.length * 1.25);
			newArray.set(oldArray);
			return newArray;
		};
		const concat = (a1, a2, index) => {
			if (index + a2.length > vertices.length) vertices = increaseArray(vertices);
			for (let i = 0, l = a2.length; i < l; i++) {
				a1[index++] = a2[i];
			}
			return index;
		};
		const Rect = class {
			constructor(x, y, w, h, level) {
				this.x = x;
				this.y = y;
				this.w = w;
				this.h = h;
				this.level = level;
			}
			draw() {
				iV = concat(vertices, cube(
					(this.x - width * 0.5) * 0.05,
					this.level,
					(this.y - height * 0.5) * 0.05,
					this.w * 0.05, 
					1,
					this.h * 0.05,
				), iV);
			}
		};
		const rect = new Rect(0, 0, width, height, 0);
		const divide = (rect) => {
			rect.draw();
			const hw = rect.w * 0.5;
			const hh = rect.h * 0.5;
			if (Math.random() <= 5.0 / (rect.level + 1)) {
				if (Math.random() <= 0.5) {
					divide(new Rect(rect.x, rect.y, rect.w, hh, rect.level + 1));
					divide(new Rect(rect.x, rect.y + hh, rect.w, hh, rect.level + 1));
				} else {
					divide(new Rect(rect.x, rect.y, hw, rect.h, rect.level + 1));
					divide(new Rect(rect.x + hw, rect.y, hw, rect.h, rect.level + 1));
				}
			}
		}
		divide(rect);
		attribute(canvas.program, "aPosition", vertices, 3, 24, 0);
		attribute(canvas.program, "aNormal", null, 3, 24, 12);
		return iV / 6;
	}
	////////////////////////////////////////////////////////////////
	const pointer = {
		init(canvas) {
			this.x = canvas.width * 0.5;
			this.y = canvas.height * 0.5;
			this.ex = this.x;
			this.ey = this.y;
			["mousedown", "touchdown"].forEach(event => {
				document.addEventListener(event, e => {
					e.preventDefault();
					numElements = blocks();
					num = 30;
				}, false);
			});
			["mousemove", "touchmove"].forEach((event, touch) => {
				canvas.elem.addEventListener(
					event,
					e => {
						if (touch) {
							e.preventDefault();
							this.x = e.targetTouches[0].clientX;
							this.y = e.targetTouches[0].clientY;
						} else {
							this.x = e.clientX;
							this.y = e.clientY;
						}
					},
					false
				);
			});
		},
		ease(step) {
			this.ex += (this.x - this.ex) * step;
			this.ey += (this.y - this.ey) * step;
		}
	};
	pointer.init(canvas);
	////////////////////////////////////////////////////////////////
	let rxa = 0;
	const run = () => {
		requestAnimationFrame(run);
		pointer.ease(0.02);
		const rx = (pointer.ex - canvas.width * 0.5) / (canvas.width * 0.35);
		const ry = (-pointer.ey + canvas.height * 0.5) / (canvas.height * 0.35);
		camera.view
			.identity()
			.rotateX(0.5)
			.translate(0, -15, -ry * 25 - 20)
			.rotateY(Math.PI + rx * 2 + rxa)
			.load();
		gl.drawArrays(gl.TRIANGLES, 0, num);
		if (num < numElements) num += 30;
		rxa -= 0.001;
	};
	let numElements = blocks();
	let num = numElements;
	run();
}