var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}console.clear();

var scene = new THREE.Scene(),
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
renderer = new THREE.WebGLRenderer(),
lights = [],
world = new CANNON.World(),
timeStep = 1 / 60,
raycaster = new THREE.Raycaster(),
mouse = new THREE.Vector2(),
startDate = new Date().getTime(),
lightMass = 5;

var now = startDate,
clickWall = undefined,
clickables = [];

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).
		toString(16).
		substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

world.gravity.set(0, 20, 0);
world.broadphase = new CANNON.NaiveBroadphase();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 30;
camera.rotation.z = Math.PI;var

Light = function () {
	function Light(_ref) {var startPosition = _ref.startPosition,frozen = _ref.frozen;_classCallCheck(this, Light);
		this.createdDate = now;
		this.flickerDate = now + 8 * 1000;
		this.expireDate = this.flickerDate + 1 * 1000;
		this.frozen = frozen ? frozen : false;
		this.startPosition = startPosition ? startPosition : { x: 0, y: 0, z: 0 };

		this.mass = lightMass;
		this.radius = 0.75;

		this.constructPhysics();
		this.constructTHREE();

		lights.push(this);
	}_createClass(Light, [{ key: 'constructPhysics', value: function constructPhysics()

		{var
			mass = this.mass,radius = this.radius,startPosition = this.startPosition,
			x = startPosition.x,y = startPosition.y,z = startPosition.z,
			sphereShape = new CANNON.Sphere(radius),
			sphereBody = new CANNON.Body({ mass: mass, shape: sphereShape });

			sphereBody.addShape(sphereShape);

			sphereBody.position = new CANNON.Vec3(x, y, z);
			this.physicsBody = sphereBody;
			world.add(sphereBody);
		} }, { key: 'constructTHREE', value: function constructTHREE()

		{
			var object = new THREE.Object3D();var

			mass = this.mass,radius = this.radius,startPosition = this.startPosition,
			x = startPosition.x,y = startPosition.y,z = startPosition.z,
			geometry = new THREE.SphereGeometry(radius, 30, 30),
			material = new THREE.MeshPhongMaterial({
				color: 0xfffe5b,
				emissive: 0xffffe7,
				specular: 0x111111,
				shininess: 30 }),

			mesh = new THREE.Mesh(geometry, material);

			var light1 = new THREE.PointLight(0xfffdbb, 5, 50);
			var light2 = new THREE.PointLight(0xffd58c, 10, 50);

			this.light1 = light1;this.light2 = light2;this.sphere = mesh;

			light1.position.set(0, 0, 0);
			light2.position.set(0, 0, 0);

			mesh.position.set(0, 0, 0);
			object.add(mesh);
			object.add(light1);
			object.add(light2);

			object.position.x = x;
			object.position.y = y;
			object.position.z = z;

			this.mesh = object;

			light1.name = guid();
			light2.name = guid();
			mesh.name = guid();

			scene.add(object);
		} }, { key: 'unfreeze', value: function unfreeze()

		{
			var p = this.mesh.position;
			this.frozen = false;
			this.physicsBody.velocity = new CANNON.Vec3(0, 0, 0);
			this.physicsBody.position = new CANNON.Vec3(p.x, p.y, p.z);
		} }, { key: 'flicker', value: function flicker()

		{var
			light1 = this.light1,light2 = this.light2,sphere = this.sphere;
			if (Math.random() * 4 > 2) {
				light1.visible = false;
				light2.visible = false;
				sphere.visible = false;
				sphere.material.visible = false;
			} else {
				light1.visible = true;
				light2.visible = true;
				sphere.visible = true;
				sphere.material.visible = true;
			}
		} }, { key: 'expire', value: function expire()

		{var
			light1 = this.light1,light2 = this.light2,sphere = this.sphere;

			light1.visible = false;
			light2.visible = false;
			sphere.visible = false;
			sphere.remove();

			world.remove(this.physicsBody);
			lights[lights.indexOf(this)] = undefined;
		} }, { key: 'update', value: function update()

		{var
			mesh = this.mesh,physicsBody = this.physicsBody,flickerDate = this.flickerDate,expireDate = this.expireDate,frozen = this.frozen;

			if (now >= flickerDate) this.flicker();
			if (now >= expireDate) this.expire();

			if (!frozen) {
				mesh.position.copy(physicsBody.position);
				mesh.quaternion.copy(physicsBody.quaternion);
			}
		} }]);return Light;}();


function createCenterpiece(x, y, z, r) {
	var sphereShape = new CANNON.Sphere(r);
	var groundBody = new CANNON.Body({ mass: 0, shape: sphereShape });
	groundBody.position = new CANNON.Vec3(x, y, z);
	world.add(groundBody);

	var geometry = new THREE.SphereGeometry(r, 50, 50),
	material = new THREE.MeshPhongMaterial({
		color: 0x111111,
		specular: 0x111111,
		shininess: 30 }),

	mesh = new THREE.Mesh(geometry, material);

	mesh.position.x = x;
	mesh.position.y = y;
	mesh.position.z = z;

	scene.add(mesh);
}

function createGround() {
	var groundShape = new CANNON.Plane();
	var groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
	groundBody.position = new CANNON.Vec3(0, 12, 0);
	groundBody.quaternion.setFromEuler(Math.PI / 2, 0, 0);
	world.add(groundBody);

	var geometry = new THREE.PlaneGeometry(200, 200, 1),
	material = new THREE.MeshPhongMaterial({
		color: 0x111111,
		specular: 0x111111,
		shininess: 30 }),

	plane = new THREE.Mesh(geometry, material);

	plane.position.y = 12;
	plane.rotation.x = Math.PI * .5;

	scene.add(plane);
}

function createClickWall() {
	var geometry = new THREE.PlaneGeometry(100, 100, 1),
	material = new THREE.MeshBasicMaterial({ color: 0x000033, visible: false, alphaTest: false }),
	plane = new THREE.Mesh(geometry, material);
	clickWall = plane;
	clickables.push(plane);
	scene.add(plane);
}


createClickWall();
createGround();

createCenterpiece(0, -5, 0, 2.5);
createCenterpiece(5, 2.5, 0, 2.5);
createCenterpiece(-5, 2.5, 0, 2.5);

function render() {
	now = new Date().getTime();
	world.step(timeStep);

	lights.map(function (light) {
		if (light) light.update();
	});

	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
render();



new Light({ startPosition: { x: 2, y: -30, z: -.3 }, frozen: false });
new Light({ startPosition: { x: -2, y: -30, z: -.3 }, frozen: false });

new Light({ startPosition: { x: 4, y: -38, z: -.3 }, frozen: false });
new Light({ startPosition: { x: -4, y: -38, z: -.3 }, frozen: false });


setTimeout(function () {
	var b1 = new Light({ startPosition: { x: 30, y: 5, z: 0 } }),
	b2 = new Light({ startPosition: { x: -30, y: 5, z: 0 } });

	b1.physicsBody.velocity = new CANNON.Vec3(-10.5, -29, 0);
	b2.physicsBody.velocity = new CANNON.Vec3(10.5, -29, 0);
}, 2000);


setTimeout(function () {
	var b1 = new Light({ startPosition: { x: 7.5, y: 5, z: -30 } }),
	b2 = new Light({ startPosition: { x: -7.5, y: 5, z: -30 } });

	b1.physicsBody.velocity = new CANNON.Vec3(-10, -19, 20);
	b2.physicsBody.velocity = new CANNON.Vec3(10, -19, 20);
}, 2800);

setTimeout(function () {
	var b1 = new Light({ startPosition: { x: 1, y: 0, z: 0 } }),
	b2 = new Light({ startPosition: { x: -1, y: 0, z: 0 } });

	b1.physicsBody.velocity = new CANNON.Vec3(20, -20, 0);
	b2.physicsBody.velocity = new CANNON.Vec3(-20, -20, 0);
}, 4000);

setTimeout(function () {
	var b1 = new Light({ startPosition: { x: 0, y: -10, z: -1.5 } }),
	b2 = new Light({ startPosition: { x: 1.5, y: -10, z: 0 } }),
	b3 = new Light({ startPosition: { x: 0, y: -10, z: 1.5 } }),
	b4 = new Light({ startPosition: { x: -1.5, y: -10, z: 0 } }),
	b5 = new Light({ startPosition: { x: 1, y: -10, z: -1 } }),
	b6 = new Light({ startPosition: { x: 1, y: -10, z: 1 } }),
	b7 = new Light({ startPosition: { x: -1, y: -10, z: 1 } }),
	b8 = new Light({ startPosition: { x: -1, y: -10, z: -1 } });

	new Light({ startPosition: { x: 0, y: -0, z: 0 } });

	b1.physicsBody.velocity = new CANNON.Vec3(0, -10, -10);
	b2.physicsBody.velocity = new CANNON.Vec3(10, -10, 0);
	b3.physicsBody.velocity = new CANNON.Vec3(0, -10, 10);
	b4.physicsBody.velocity = new CANNON.Vec3(-10, -10, 0);
	b5.physicsBody.velocity = new CANNON.Vec3(10, -10, -10);
	b6.physicsBody.velocity = new CANNON.Vec3(10, -10, 10);
	b7.physicsBody.velocity = new CANNON.Vec3(-10, -10, 10);
	b8.physicsBody.velocity = new CANNON.Vec3(-10, -10, -10);
}, 12000);

document.body.addEventListener('mouseup', function (e) {
	mouse.x = e.clientX / window.innerWidth * 2 - 1;
	mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);

	var intersects = raycaster.intersectObjects(clickables),
	p = intersects.length > 0 ? intersects[0].point : new THREE.Vector3(0, 0, 0);


	new Light({ startPosition: { x: p.x, y: p.y, z: Math.random() } });
});