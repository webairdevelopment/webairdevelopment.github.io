function FakeConsole() {
    var _this = this;
    this.consoleWindow = document.createElement("div");
    this.consoleWindow.style = "width: 450px; height: 100%; background-color: white; position: fixed; right: 0; top: 0; box-shadow: -5px 0 10px grey; border: 2px solid gray; font-family: Courier New; overflow: auto;";
    document.body.appendChild(this.consoleWindow);
    
    console.log = function(text) {
        var div = document.createElement("div");
        div.style = "width: 100%; height: 30px; border: 1px solid black; padding-left: 20px; display: flex; align-items: center;";
        div.innerHTML = "<b>></b>&ensp;" + JSON.stringify(text);
        _this.consoleWindow.appendChild(div);
    };
    
    window.onerror = function(e) {
        var div = document.createElement("div");
        div.style = "width: 100%; height: 30px; border: 1px solid black; padding-left: 20px; display: flex; align-items: center; color: red;";
        div.innerHTML = "<b>X</b>&ensp;" + e;
        _this.consoleWindow.appendChild(div);
    };
    
    this.closeConsole = function() {
        this.consoleWindow.style.display = "none";
    };
    
    this.openConsole = function() {
        this.consoleWindow.style.display = "flex";
    };
}