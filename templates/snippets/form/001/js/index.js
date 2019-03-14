document.addEventListener("DOMContentLoaded",fns);

function fns(){
	// auto tabbing between number fields
	var inputs = document.querySelectorAll("form input");
	for (i in inputs) {
		if (i < inputs.length) {
			inputs[i].addEventListener("input",function(){
				if (this.value.length === 1) {
					if (this.nextSibling.tagName == "INPUT") {
						this.nextSibling.focus();
						this.nextSibling.select();
					}
				}
			});
		}
	}

	// flipping
	var btn = document.querySelector("button");
	btn.addEventListener("click", function(){
		var checkbox = document.querySelector("input[type=checkbox]");
		checkbox.checked = !checkbox.checked;
	});
}