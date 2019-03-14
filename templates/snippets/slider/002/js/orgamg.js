// localStorage.clear()

// console.time()

function shouldCallAPI() {
	if (
		window.location.href.includes("/fullpage/") ||
		window.location.href.includes("/boomerang/") ||
		window.location.href.includes("/debug/")
	) {
		// console.log('VIEW from pen directly',getOrigin())
		return true;
	} else if (window.location.href.includes("embed")) {
		// console.log('VIEW from pen embeded',getOrigin())
		return true;
	} else {
		// console.log('VIEW from excluded page')
		return false;
	}
}

let origin = getOrigin();

function API(id) {
	if (id !== "") {
		if (shouldCallAPI()) {
			// console.log("CA MACTH");
			// let id = getPenId();
			let firstSeen = updateLocalStorage(id);

			getUserIp().then(data => {
				console.log(
					"first seen:",
					firstSeen,
					" penId :",
					id,
					// " user ip :",
					// data.ip,
					" pays :",
					data.country,
					" origin :",
					origin
				);
				// API call
				// console.timeEnd()
				if (firstSeen === true) {
					axios({
						method: "post",
						url:
							"https://cors-anywhere.herokuapp.com/https://www.antoinepluchon.com/api/newView",
						data: {
							country: data.country,
							idPen: id,
							origin: origin
						}
					});
				}
			});
		} else {
			// console.log("CA MACTH PAS");
		}
	}
}

function getPenId() {
	console.log(window.location.href);
	let referrer = new URL(window.document.referrer);
	let id = referrer.pathname.slice(-6);
	return id;
}

function getUserIp() {
	return new Promise(function(resolve, reject) {
		axios
			.get("https://get.geojs.io/v1/ip/country.json")
			.then(response => {
				resolve({ ip: response.data.ip, country: response.data.name });
			})
			.catch(error => {
				axios
					.get("https://extreme-ip-lookup.com/json")
					.then(response => {
						resolve({ ip: response.data.query, country: response.data.country });
					})
					.catch(error => {
						axios
							.get("https://ipapi.co/json")
							.then(response => {
								resolve({ ip: response.data.ip, country: response.data.country_name });
							})
							.catch(error => {
								resolve({ ip: undefined, country: "unknown" });
							});
					});
			});
	});
}

function getOrigin() {
	let origin;
	if (!!window.location.ancestorOrigins) {
		origin = new URL(
			window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
		).hostname;
	} else {
		if (window.location.href.includes("embed")) {
			origin = "unknown";
		} else {
			origin = "codepen.io";
		}
	}

	// console.log("embeded:", origin);

	return origin;
}

function updateLocalStorage(id) {
	let isFirstSeen;
	if (!localStorage.clementRoche) {
		let storage = {};
		storage[id] = Date.now();
		localStorage.clementRoche = JSON.stringify(storage);
		// console.log("first seen", "initialised");
		isFirstSeen = true;
	} else {
		let storage = JSON.parse(localStorage.clementRoche);
		// console.log("already initialised");
		if (storage[id]) {
			// console.log("already seen");
			isFirstSeen = false;
		} else {
			// console.log("first seen");
			isFirstSeen = true;
		}
		storage[id] = Date.now();
		localStorage.clementRoche = JSON.stringify(storage);
	}
	return isFirstSeen;
}
