// variable definitions
let colorButtons = document.querySelectorAll(".spaceButt");
let currentColor = "transparent";
let pixelboard = document.querySelector(".pixelboard");
let columninput = document.getElementById("columninput");
let rowinput = document.getElementById("rowinput");
let gridunitsize = document.getElementById("gridunitsize");
let imgbgtoggle = document.getElementById("imgbgtoggle");
let mouseDown = false;
let buttons = document.querySelectorAll(".colorbutton button");
let textinputs = document.querySelectorAll('.colorbutton input[type="text"]');
let colorinputs = document.querySelectorAll('.colorbutton input[type="color"]');
let infobutt = document.querySelector(".infobutt");
let disclaimer = document.querySelector(".disclaimer");

//copy helper function
let createCopy = function(textToCopy, callback = null) {
  //create the readonly textarea with the text in it and hide it
  let tarea = document.createElement("textarea");
  tarea.setAttribute("id", "copyarea");
  tarea.setAttribute("readonly", "readonly");
  tarea.setAttribute(
    "style",
    "opacity: 0; position: absolute; z-index: -1; top: 0; left: -9999px;"
  );
  tarea.appendChild(document.createTextNode(textToCopy));
  document.body.appendChild(tarea);

  //select and copy the text in the readonly text area
  tarea.select();
  document.execCommand("copy");

  //remove the element from the DOM
  document.body.removeChild(tarea);

  //fire callback function if provided
  if (typeof callback === "function" && callback()) {
    callback();
  }
};

//recognize when mouse is pressed
document.body.onmousedown = function() {
  mouseDown = true;
};
document.body.onmouseup = function() {
  mouseDown = false;
};

// button pressing and paintbrush loading
for (let index = 0; index < colorButtons.length; index++) {
  const element = colorButtons[index];
  element.addEventListener("click", function() {
    let pressedButt = document.querySelector(".pressed");
    if (pressedButt) {
      pressedButt.classList.remove("pressed");
    }

    if (this == pressedButt) {
      currentColor = "transparent";
    } else {
      this.classList.add("pressed");
      currentColor = this.dataset.color;
    }
  });
}

//event listeners on grid to allow paintbrush to paint
let wireUpSquares = function() {
  let gridSquares = document.querySelectorAll(".pixelboard div");
  for (let index = 0; index < gridSquares.length; index++) {
    const element = gridSquares[index];
    element.addEventListener("mousedown", function(e) {
      this.style.backgroundColor = currentColor;
      e.preventDefault();
    });
    element.addEventListener("mouseenter", function(e) {
      if (mouseDown) {
        this.style.backgroundColor = currentColor;
      }
      e.preventDefault();
    });
  }
};

function isEven(n) {
  return n % 2 == 0;
}

//generate the one div style block
let generateCode = function() {
  let widthSq = parseInt(columninput.value);
  let heightSq = parseInt(rowinput.value);
  let sqMeasW = isEven(widthSq) ? widthSq / 2 : (widthSq - 1) / 2;
  let sqMeasH = isEven(heightSq) ? heightSq / 2 : (heightSq - 1) / 2;
  let sqPadW = isEven(widthSq) ? sqMeasW - 1 : sqMeasW;
  let sqPadH = isEven(heightSq) ? sqMeasH - 1 : sqMeasH;
  let backString = "";
  let hOff = -(sqPadW + 1);
  let vOff = -(sqMeasH + 1);
  let styleString = `content: '';
    display: block;
    font-size: ${gridunitsize.value}px;
    width: 1em;
    height: 1em;
    margin: ${sqMeasH}em ${sqMeasW}em ${sqPadH}em ${sqPadW}em;
    box-shadow:`;

  for (let index = 0; index < widthSq * heightSq; index++) {
    let dBG = document.querySelector(
      ".pixelboard div:nth-child(" + (index + 2) + ")"
    ).style.backgroundColor;
    sqColor = dBG ? dBG : "transparent";
    let row = Math.ceil((index + 1) / widthSq);
    let col = ((index + 1) / widthSq - (row - 1)) / (1 / widthSq);
    let vEm = Math.round(row + vOff);
    let hEm = Math.round(col + hOff);
    if (vEm === 0 && hEm === 0) {
      backString = `background-color: ${sqColor};`;
    } else if (sqColor !== "transparent") {
      styleString += `${hEm}em ${vEm}em 0 0 ${sqColor},`;
    }
  }
  var finalStyle = backString + styleString.replace(/.$/, ";");
  document.getElementById("space-invader").setAttribute("style", finalStyle);
  pixelboard.style.display = "none";
  document.querySelector(".pcard").style.boxShadow = "none";
  document.querySelector(".pcard").style.borderRadius = "0px";
  let knobs = document.querySelectorAll(".knob");
  for (let index = 0; index < knobs.length; index++) {
    const element = knobs[index];
    element.style.display = "none";
  }
  createCopy(finalStyle, function() {
    alert(
      "css has been copied to your clipboard... go apply it to an empty div :)"
    );
  });
};

//file input wiring
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      pixelboard.style.backgroundImage = "url('" + e.target.result + "')";
      imgbgtoggle.disabled = false;
      imgbgtoggle.checked = true;
      pixelboard.classList.remove("hide0");
    };

    reader.readAsDataURL(input.files[0]);
  }
}

//mouse events for drag and drop image BG for grid
let turnDropOff = function() {
  document.querySelector(".file-upload-input").style.display = "none";
};
pixelboard.addEventListener("dragenter", function(e) {
  document.querySelector(".file-upload-input").style.display = "inherit";
});
pixelboard.addEventListener("drop", function(e) {
  turnDropOff();
});
document.body.addEventListener("mouseleave", function(e) {
  turnDropOff();
});

//grid creation function
let createGrid = function(row, col, unitsize) {
  console.log("firing");
  let currentG = document.querySelectorAll(".pixelboard div");
  for (let index = 0; index < currentG.length; index++) {
    const element = currentG[index];
    element.parentNode.removeChild(element);
  }
  for (let index = 0; index < row * col; index++) {
    var emptyDiv = document.createElement("div");
    pixelboard.appendChild(emptyDiv);
  }

  pixelboard.style.gridTemplateColumns = `repeat(${col}, ${unitsize}px)`;
  pixelboard.style.gridTemplateRows = `repeat(${row}, ${unitsize}px)`;
  wireUpSquares();
};

//listners on the grid adjustment inputs to recreate the grid
columninput.addEventListener("input", function() {
  createGrid(rowinput.value, columninput.value, gridunitsize.value);
});
rowinput.addEventListener("input", function() {
  createGrid(rowinput.value, columninput.value, gridunitsize.value);
});
gridunitsize.addEventListener("input", function() {
  createGrid(rowinput.value, columninput.value, gridunitsize.value);
});

//create initial grid on document load
document.onload = createGrid(
  rowinput.value,
  columninput.value,
  gridunitsize.value
);

//helper function to change color of button
let changeColorButton = function(number, color) {
  let butt = document.getElementById("button" + number);
  butt.setAttribute("data-color", color);
  butt.setAttribute(
    "style",
    `background-color: ${color}; box-shadow: -5px 4px 0px ${color}, -6px 5px 0px #000;`
  );
};

//helper function to change color of text input
let changeColorText = function(number, color) {
  let text = document.getElementById("textinput" + number);
  text.value = color;
};

//helper function to change color of color input
let changeColorPicker = function(number, color) {
  let picker = document.getElementById("colorinput" + number);
  picker.value = color;
};

//event listeners for color inputs to change color of corresponding text input and button
for (let index = 0; index < colorinputs.length; index++) {
  const element = colorinputs[index];
  element.addEventListener("change", function() {
    changeColorButton(index + 1, this.value);
    changeColorText(index + 1, this.value);
    currentColor = document.querySelector(".pressed").dataset.color;
  });
}

//event listeners for text inputs to change color of corresponding color input and button
for (let index = 0; index < textinputs.length; index++) {
  const element = textinputs[index];
  element.addEventListener("change", function() {
    changeColorButton(index + 1, this.value);
    changeColorPicker(index + 1, this.value);
    currentColor = document.querySelector(".pressed").dataset.color;
  });
}

//toggle the pixelboard background based on the imgbg checkbox input
imgbgtoggle.addEventListener("change", function() {
  pixelboard.classList.toggle("hide0");
});

//add event listener to #gencode div to generate the css and to show the user the final single-div art!
document.getElementById("gencode").addEventListener("click", function() {
  generateCode();
});

//show info about pen on infobutt click
infobutt.addEventListener("click", function() {
  disclaimer.classList.toggle("hide1");
});
disclaimer.addEventListener("click", function() {
  disclaimer.classList.toggle("hide1");
});