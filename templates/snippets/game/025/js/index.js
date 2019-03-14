
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}Vue.component('sea-battle', {
	template: '#space',
	props: ['oms', 'visibleStatus', 'shots'],
	data: function data() {
		return {
			cellAmount: {
				x: 10,
				y: 10 },

			mainFieldSize: {
				x: 50,
				y: 50 },

			battleShips: [
			{
				mode: 4,
				amount: 1,
				color: '#D32F2F' },

			{
				mode: 3,
				amount: 2,
				color: '`#1976D2' },

			{
				mode: 2,
				amount: 3,
				color: '#00796B' },

			{
				mode: 1,
				amount: 4,
				color: '#FBC02D' }],


			directParams: [
			{
				direction: 'up',
				step: -10 },

			{
				direction: 'right',
				step: 1 },

			{
				direction: 'down',
				step: 10 },

			{
				direction: 'left',
				step: -1 }],


			commonAmount: 0,
			shipsCoordinates: [],
			rows: [],
			excludedPosition: [],
			cornerCells: [] };

	},
	methods: {
		paintShips: function paintShips(id) {
			var commonArray = [];
			this.shipsCoordinates.forEach(function (c) {
				commonArray = [].concat(_toConsumableArray(commonArray), _toConsumableArray(c.positions));
			});
			return commonArray.indexOf(id) !== -1;
		},
		getRandomValue: function getRandomValue(arr) {
			return arr[Math.floor(Math.random() * arr.length)];
		},
		getCommonCellAmount: function getCommonCellAmount() {
			this.commonAmount = this.cellAmount.x * this.cellAmount.y;
		},
		generateShipsCoordinates: function generateShipsCoordinates() {var _this = this;
			this.battleShips.forEach(function (ship) {
				for (var i = 0; i < ship.amount; i++) {
					_this.setShip(ship.mode);
				}
			});
		},
		setShip: function setShip(decksAmount) {var _this2 = this;
			var indexPosition = this.getUniqueRandomIndexPosition();
			var shipsRelatives = this.getDirections(indexPosition, decksAmount);
			var isMatch = shipsRelatives.filter(function (sr) {
				var flag = true;
				sr.positions.forEach(function (pos) {
					flag = flag && _this2.excludedPosition.indexOf(pos) === -1;
				});
				if (flag) return sr;
			});
			if (isMatch.length === 0) {
				this.setShip(decksAmount);
			}
			if (isMatch.length !== 0) {
				var currentShipData = this.getRandomValue(isMatch);
				//console.log(currentShipData);
				var cv = Object.create(null);
				cv = _extends({}, currentShipData);
				this.shipsCoordinates.push(cv);
				this.getArroundEmptyCell(currentShipData);
			}
		},
		getArroundEmptyCell: function getArroundEmptyCell(shipData) {var _this3 = this;
			var len = shipData.positions.length;

			shipData.positions.forEach(function (pos, index, arr) {

				_this3.excludedPosition.push(pos);

				if (pos + 10 < _this3.commonAmount - 1) {
					_this3.excludedPosition.push(pos + 10);
				}
				if (pos - 10 > 0) {
					_this3.excludedPosition.push(pos - 10);
				}
				if (_this3.getCurrentRow(pos).indexOf(pos + 1) !== -1) {
					_this3.excludedPosition.push(pos + 1);
				}
				if (_this3.getCurrentRow(pos).indexOf(pos - 1) !== -1) {
					_this3.excludedPosition.push(pos - 1);
				}
			});
			this.removeDoublesInExcludedPositions();
		},
		getCurrentRow: function getCurrentRow(id) {
			return this.rows.find(function (r, index, arr) {
				return Math.floor(r[0] / 10) === Math.floor(id / 10);
			});
		},
		getUniqueRandomIndexPosition: function getUniqueRandomIndexPosition() {
			var currentValue = Math.floor(Math.random() * this.commonAmount);
			if (!this.excludedPosition.length) {
				return currentValue;
			}
			if (this.excludedPosition.length !== 0) {
				if (this.excludedPosition.indexOf(currentValue) === -1) {
					return currentValue;
				} else {
					var u = this.getUniqueRandomIndexPosition();
					return u;
				}
			}
		},
		isOccupyCell: function isOccupyCell(id) {
			return this.excludedPosition.indexOf(id) !== -1;
		},
		isCoronerCell: function isCoronerCell(id) {
			return this.cornerCells.indexOf(id) !== -1;
		},
		isExcludedPosition: function isExcludedPosition(id) {
			return this.excludedPosition.indexOf(id) !== -1;
		},
		removeDoublesInExcludedPositions: function removeDoublesInExcludedPositions() {
			this.excludedPosition = this.excludedPosition.filter(function (v, i, ar) {
				return ar.indexOf(v) === i;
			});
		},
		getDirections: function getDirections(id, decksAmount) {var _this4 = this;
			var beginPosition = id;
			var stepPosition = id;
			var flag = true;
			var relativeDirections = [];
			var condition = null;
			var positions = [];
			this.directParams.forEach(function (p) {
				for (var i = 0; i < decksAmount; i++) {
					if (p.direction === 'up') {
						condition = stepPosition < 0;
					}if (p.direction === 'right') {
						condition = _this4.getCurrentRow(beginPosition).indexOf(stepPosition) === -1;
					}if (p.direction === 'down') {
						condition = stepPosition > _this4.commonAmount - 1 && !_this4.isOccupyCell(stepPosition);
					}if (p.direction === 'left') {
						condition = _this4.getCurrentRow(beginPosition).indexOf(stepPosition) === -1;
					}
					flag = flag && !condition;
					positions.push(stepPosition);
					stepPosition += p.step;
				};
				if (flag) {
					p.positions = positions;
					p.mode = decksAmount;
					relativeDirections.push(p);
				}
				flag = true;
				stepPosition = beginPosition;
				positions = [];
			});
			return relativeDirections;
		},
		getVerticalCornerCell: function getVerticalCornerCell() {
			for (var i = 0; i < this.commonAmount + 1; i++) {
				if (i % 10 === 0) {
					this.cornerCells.push(i - 1);
					this.cornerCells.push(i);
				}
				if (i < this.cellAmount.x - 1 && i !== 0) {
					this.cornerCells.push(i);
				}
				if (
				this.commonAmount - i > this.commonAmount - this.cellAmount.x &&

				this.commonAmount - i !== this.commonAmount - 1 &&

				this.commonAmount - i !== this.commonAmount)
				{
					this.cornerCells.push(this.commonAmount - i);
				}
			}
			this.cornerCells.shift();
			this.cornerCells.pop();
			this.cornerCells = this.cornerCells.sort(function (a, b) {
				if (a > b) return 1;
				if (a < b) return -1;
				if (a === b) return 0;
			});
		},
		getRows: function getRows() {
			var temp = [];
			var step = 1;
			for (var i = 0; i < this.commonAmount; i++) {
				temp.push(i);
				if (i % (step * this.cellAmount.x - 1) === 0 && i !== 0) {
					this.rows.push(temp);
					step++;
					temp = [];
				}
			}
		},
		startGame: function startGame() {
			this.shipsCoordinates = [];
			this.rows = [];
			this.excludedPosition = [];
			this.cornerCells = [];
			this.getCommonCellAmount();
			this.getRows();
			this.getVerticalCornerCell();
			this.generateShipsCoordinates();
		} },

	created: function created() {
		this.startGame();
	},
	mounted: function mounted() {
		this.$emit('return-generate-data', this.shipsCoordinates);
	} });

Vue.component('field', {
	template: '#field',
	props: ['ships', 'fieldSize', 'cellsAmount', 'defaultCellColor', 'oms', 'visStat', 'shotsForPaint'],
	data: function data() {
		return {
			transformData: null,
			shipsColors: {
				4: { color: '#D32F2F', shooting: '#A1887F' },
				3: { color: '#1976D2', shooting: '#A1887F' },
				2: { color: '#00796B', shooting: '#A1887F' },
				1: { color: '#FBC02D', shooting: '#A1887F' } } };


	},
	methods: {
		_paintShips: function _paintShips(id) {
			var keyStatus = this.transformData[id] !== undefined;
			var isShot = this.shotsForPaint[id] !== undefined;
			if (isShot && keyStatus) {
				return 'black';
			} else if (keyStatus) {
				return this.transformData[id].color;
			}
		},
		getTransformData: function getTransformData() {var _this5 = this;
			this.transformData = Object.create(null);
			this.ships.forEach(function (ship) {
				var arr = ship.positions.forEach(function (s) {
					var color = _this5.shipsColors[ship.mode].color;
					_this5.transformData[s] = { color: color, loseColor: '#ddd', fillColor: '#fff' };
				});
			});
		} },

	computed: {
		getContainerSize: function getContainerSize() {
			return {
				x: this.fieldSize.x * this.cellsAmount.x,
				y: this.fieldSize.y * this.cellsAmount.y };

		},
		getCellAmount: function getCellAmount() {
			return this.cellsAmount.x * this.cellsAmount.y;
		} },

	created: function created() {
		this.getTransformData();
	} });


Vue.component('cell', {
	template: '#cell',
	props: ['mode', 'color', 'status', 'size'],
	data: function data() {
		return {};
	},
	computed: {
		frontStyles: function frontStyles() {
			return {
				width: this.size.x + 'px',
				height: this.size.y + 'px',
				transform: 'translate3d(0, 0, ' + this.size.x / 2 + 'px)',
				backgroundColor: this.color,
				border: '1px solid #fff' };

		},
		leftStyles: function leftStyles() {
			return {
				height: this.size.y + 'px',
				width: this.size.x / 2 + 'px',
				backgroundColor: this.color,
				border: '1px solid #fff' };

		},
		rightStyles: function rightStyles() {
			return {
				height: this.size.y + 'px',
				width: this.size.x / 2 + 'px',
				transform: 'rotateY(-90deg) translateZ(-' + this.size.x + 'px)',
				backgroundColor: this.color,
				border: '1px solid #fff' };

		},
		topStyles: function topStyles() {
			return {
				width: this.size.x + 'px',
				height: this.size.y / 2 + 'px',
				transform: 'rotateX(90deg) translateZ(-' + this.size.x + 'px)',
				backgroundColor: this.color,
				border: '1px solid #fff' };

		},
		bottomStyles: function bottomStyles() {
			return {
				width: this.size.x + 'px',
				height: this.size.y / 2 + 'px',
				transform: 'rotateX(90deg) translateZ(0)',
				backgroundColor: this.color,
				border: '1px solid #fff' };

		} },

	created: function created() {

	} });

Vue.component('info-banner', {
	template: '#info',
	props: ['userData', 'botData', 'LuckyShots'] });

Vue.component('hub', {
	template: '#hub',
	props: ['rst'],
	data: function data() {
		return {
			bd: document.querySelector('body'),
			userData: null,
			botData: null,
			userShots: Object.create(null),
			botShot: Object.create(null),
			finalBannerStatus: false,
			finalBannerMode: '',
			botShotAmount: 0,
			botLuckyshot: 0,
			userShotAmount: 0,
			userLuckyshot: 0,
			transformData: {},
			transformDataForUser: {},
			dataForPaintEnemyFields: Object.create(null),
			dataForPaintUserFields: Object.create(null),
			fieldParams: {
				amountX: 10,
				amountY: 10,
				sizeX: 10,
				sizeY: 10 },

			isOpenActionEnemyField: false,
			rerender: true,
			isShot: {
				user: {
					status: false,
					content: 'Yeeeah!!!' },

				enemy: {
					status: false,
					content: 'X _ X' } } };



	},
	methods: {
		closeFinalBanner: function closeFinalBanner() {
			this.finalBannerStatus = false;
		},
		addShot: function addShot(mode, id) {var _this6 = this;
			if (mode === 'user') {
				this.userShots[id] = { color: 'red', loseColor: '#ddd', fillColor: '#fff', mode: mode };
				this.userShots = _extends({}, this.userShots);
				this.userShotAmount++;
				this.setDataForPaintEnemyFields();
				setTimeout(function () {_this6.setBotStep();}, 1000);

			}
			if (mode === 'bot') {
				this.botShot[id] = { color: 'black', loseColor: '#ddd', fillColor: '#fff', mode: mode };
				this.botShot = _extends({}, this.botShot);
				this.botShotAmount++;
				this.setDataForPaintUserFields();
			}

		},
		getUserData: function getUserData(a) {
			this.userData = a;
		},
		getBotData: function getBotData(a) {
			this.botData = a;
		},
		openActionEnemyField: function openActionEnemyField() {
			this.isOpenActionEnemyField = !this.isOpenActionEnemyField;
		},
		setDataForPaintEnemyFields: function setDataForPaintEnemyFields() {
			this.dataForPaintEnemyFields = _extends({}, this.userShots);
			for (var key in this.userShots) {
				if (this.transformData[key] !== undefined) {
					this.dataForPaintEnemyFields[key].status = 'shot';
				} else {
					this.dataForPaintEnemyFields[key].status = 'lose';
				}
			}
		},
		setDataForPaintUserFields: function setDataForPaintUserFields() {
			this.dataForPaintUserFields = _extends({}, this.botShot);
			for (var key in this.botShot) {
				if (this.transformDataForUser[key] !== undefined) {
					this.dataForPaintUserFields[key].status = 'shot';
				} else {
					this.dataForPaintUserFields[key].status = 'lose';
				}
			}
		},
		getTransformData: function getTransformData() {var _this7 = this;
			this.transformData = Object.create(null);
			this.botData.forEach(function (ship) {
				var arr = ship.positions.forEach(function (s) {
					//let color = this.shipsColors[ship.mode].color;
					var id = '' + s;
					_this7.transformData[id] = { color: 'blue' };
				});
			});
		},
		getTransformDataForUser: function getTransformDataForUser() {var _this8 = this;
			this.transformDataForUser = Object.create(null);
			this.userData.forEach(function (ship) {
				var arr = ship.positions.forEach(function (s) {
					//let color = this.shipsColors[ship.mode].color;
					var id = '' + s;
					_this8.transformDataForUser[id] = { color: 'blue' };
				});
			});
		},
		setBotStep: function setBotStep() {
			this.addShot('bot', this.getRandomForBotShot());
		},
		getRandomForBotShot: function getRandomForBotShot() {
			var r = Math.floor(Math.random() * (this.fieldParams.amountX * this.fieldParams.amountY - 1));
			if (this.botShotAmount === this.fieldParams.amountX * this.fieldParams.amountY) {
				return false;
			} else {
				return this.botShot[r] === undefined ? r : this.getRandomForBotShot();
			}
		},
		watchCount: function watchCount() {
			if (this.userLuckyshot === 20 || this.botLuckyshot === 20) {
				this.isOpenActionEnemyField = false;
				this.finalBannerStatus = true;
				if (this.userLuckyshot === 20) {
					this.finalBannerMode = 'win';
				} else if (this.botLuckyshot === 20) {
					this.finalBannerMode = 'lose';
				}
			}
		},
		_restartGame: function _restartGame() {
			this.rst();
		},
		shotDetect: function shotDetect(u, b) {var _this9 = this;
			if (u > this.botLuckyshot) {
				console.log('bot shot: ', u);
				this.bd.style.backgroundColor = "rgba(255, 0, 0, 0.6)";
				this.isShot.enemy.status = true;
				setTimeout(function () {
					_this9.bd.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
					_this9.isShot.enemy.status = false;
				}, 1100);
			}
			if (b > this.userLuckyshot) {
				console.log('user shot:', b);
				setTimeout(function () {
					_this9.bd.style.backgroundColor = "rgba(0, 200, 0, 0.6)";
					_this9.isShot.user.status = true;
				}, 900);
				setTimeout(function () {
					_this9.bd.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
					_this9.isShot.user.status = false;
				}, 1900);
			}
		} },

	computed: {
		getShotes: function getShotes() {

			var lcu = 0;
			var lcb = 0;
			for (var a in this.dataForPaintEnemyFields) {
				if (this.dataForPaintEnemyFields[a].status === 'shot') {
					lcb++;
				}
			}
			for (var x in this.dataForPaintUserFields) {
				if (this.dataForPaintUserFields[x].status === 'shot') {
					lcu++;
				}
			}
			this.shotDetect(lcu, lcb);
			this.botLuckyshot = lcu;
			this.userLuckyshot = lcb;
			this.watchCount();

			return { u: lcb, b: lcu };
		},
		test: function test() {
			console.log(this.userLuckyshot);
		} },

	mounted: function mounted() {
		this.getTransformData();
		this.getTransformDataForUser();
	} });


Vue.component('enemy-target-field', {
	template: '#enemy-target-field',
	props: ['targetFieldParams', 'actionMethod', 'userShots', 'shotsStatus'],
	data: function data() {
		return {
			fillColor: '#fff',
			isTooltipActive: true };

	},
	methods: {
		openWin: function openWin() {
			this.actionMethod();
			this.isTooltipActive = false;
		},
		getColorCell: function getColorCell(index) {
			return this.shotsStatus[index] !== undefined &&

			this.shotsStatus[index].status === 'shot' ?
			this.shotsStatus[index].color :
			this.shotsStatus[index] !== undefined &&

			this.shotsStatus[index].status === 'lose' ?
			this.shotsStatus[index].loseColor :
			this.fillColor;
		} } });


Vue.component('enemy-action-field', {
	template: '#enemy-action-field',
	props: ['targetFieldParams', 'actionMethod', 'modalStatus', 'addShotMethod', 'userShots', 'shotsStatus'],
	data: function data() {
		return {
			fillColor: '#fff' };

	},
	methods: {
		closeActionModal: function closeActionModal() {
			this.actionMethod();
		},
		setShot: function setShot(a, b) {var _this10 = this;
			this.addShotMethod(a, b);
			setTimeout(function () {
				_this10.actionMethod();
			}, 700);
		},
		getColorCell: function getColorCell(index) {
			return this.shotsStatus[index] !== undefined && this.shotsStatus[index].status === 'shot' ?
			this.shotsStatus[index].color :
			this.shotsStatus[index] !== undefined && this.shotsStatus[index].status === 'lose' ?
			this.shotsStatus[index].loseColor :
			this.fillColor;
		} } });


Vue.component('final-banner', {
	template: '#f-banner',
	props: ['status', 'openStatus', 'closeBanner', 'restart'],
	data: function data() {
		return {
			winImage: '../images/win.png',
			winText: 'You Win!',
			loseImage: '../images/lose.png',
			loseText: 'You Lose' };

	},
	methods: {
		closeBannerAction: function closeBannerAction() {
			this.closeBanner();
		},
		newGame: function newGame() {
			this.closeBanner();
			this.restart();
		} } });


Vue.component('shot-banner', {
	template: '#shot-banner',
	props: ['status', 'content', 'optClass'] });

var vm = new Vue({
	el: '#app',
	data: {
		rerender: true },

	methods: {
		restartGame: function restartGame() {var _this11 = this;
			this.rerender = false;
			setTimeout(function () {
				_this11.rerender = true;
			}, 10);
		} } });