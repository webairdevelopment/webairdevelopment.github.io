var DOMHandler = /** @class */ (function () {
    function DOMHandler() {
        this.parser = new DOMParser();
        this.bgEl = document.querySelector('.bg');
        this.slider = document.querySelector('#density');
        this.checkbox = document.querySelector('#wind');
    }
    DOMHandler.prototype.getDropDOM = function (topStart, left) {
        var doc = this.parser.parseFromString("<div class=\"drop\" style=\"top: " + topStart + "vh; left: " + left + "vw;\"></div>", "text/html");
        return doc.querySelector('div');
    };
    return DOMHandler;
}());
var Drop = /** @class */ (function () {
    function Drop(domHandler) {
        this.domHandler = domHandler;
        this.bgEl = this.domHandler.bgEl;
        this.topStart = Math.round(Math.random() * 100) - 100;
        this.leftStart = Math.round(Math.random() * 100);
        this.el = this.domHandler.getDropDOM(this.topStart, this.leftStart);
    }
    Drop.prototype.init = function (wind) {
        this.bgEl.appendChild(this.el);
        this.applyForces(wind);
    };
    Drop.prototype.applyForces = function (wind) {
        var _this = this;
        if (wind) {
            this.el.style.left = this.leftStart - 25 + "vw";
        }
        setTimeout(function () {
            _this.el.style.top = _this.topStart + 200 + "vh";
            if (wind) {
                _this.el.style.left = _this.leftStart + 25 + "vw";
            }
            setTimeout(function () {
                _this.el.remove();
            }, 2000);
        });
    };
    return Drop;
}());
var Rain = /** @class */ (function () {
    function Rain(domHandler) {
        this.domHandler = domHandler;
        this.density = 10;
        this.wind = false;
    }
    Object.defineProperty(Rain.prototype, "density", {
        get: function () {
            return this._density;
        },
        set: function (value) {
            this._density = 100 - (value + 50);
            clearInterval(this.timerID);
            this.init();
        },
        enumerable: true,
        configurable: true
    });
    ;
    Rain.prototype.init = function () {
        var _this = this;
        this.timerID = setInterval(function () {
            var drop = new Drop(_this.domHandler);
            drop.init(_this.wind);
        }, this.density);
    };
    return Rain;
}());
var rainApp = {};
rainApp.domHandler = new DOMHandler();
rainApp.rain = new Rain(rainApp.domHandler);
rainApp.slider = rainApp.domHandler.slider;
rainApp.checkbox = rainApp.domHandler.checkbox;
rainApp.slider.addEventListener('change', function () {
    rainApp.rain.density = rainApp.slider.valueAsNumber;
});
rainApp.checkbox.addEventListener('change', function () {
    rainApp.rain.wind = rainApp.checkbox.checked;
});
rainApp.rain.init();