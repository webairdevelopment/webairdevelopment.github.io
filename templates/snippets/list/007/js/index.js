var index = 0;
var checktable = [];
var deleted = [];
var count = 0;
document.getElementById("add").onclick = function tolist(){
  let list = document.getElementById("data");
  let add = document.getElementById("todo");
  let data = list.innerHTML;
  let elem = add.value;
  if(elem != ""){
  let result = "<p id=\"" + index.toString() + "\"><b>TODO#</b> "+elem + "<input type=\"checkbox\" id=\"check"+index.toString()+"\"><span class=\"cbox\"></span></p>";
  for(let i=0;i<index;i++) {
      let id = "check"+i.toString();
      let checkbox = document.getElementById(id);
      if(checkbox.checked == true) {
        checktable[i] = 1;
      }
      else checktable[i] = 0;
    }
  data += result;
  list.innerHTML = data;
  add.value = "";
  for(let i=0;i<index;i++) {
      let id = "check"+i.toString();
      let checkbox = document.getElementById(id);
      if(checktable[i] == 1) {
        checkbox.checked = true;
      }
    } 
  index++;
  let event = Math.floor((Math.random() * 5) + 1);
  let checkevent = Math.floor((Math.random() * 5) + 1);
  if(event == checkevent) {
    let l_e = document.getElementById("eL");
    let r_e = document.getElementById("eR");
    let a_l_e = document.getElementById("aeL");
    let a_r_e = document.getElementById("aeR");
    let progress = 0;
    let nextstep = 0;
    let opacity1 = 1;
    let opacity2 = 0;
      let timer = setInterval(frame, 10);
      function frame() {
      if (progress == 100) {
      clearInterval(timer);
      } else {
      if(progress > 50){
      if(nextstep == 250)
      {
      opacity1 = opacity1 + 0.04;
      opacity2 = opacity2 - 0.02;
      l_e.style.opacity = opacity1.toString();
      r_e.style.opacity = opacity1.toString();
      a_l_e.style.opacity = opacity2.toString();
      a_r_e.style.opacity = opacity2.toString();
      progress++;
      }
      else nextstep++;
      }
      else{
      opacity1 = opacity1 - 0.04;
      opacity2 = opacity2 + 0.02;
      l_e.style.opacity = opacity1.toString();
      r_e.style.opacity = opacity1.toString();
      a_l_e.style.opacity = opacity2.toString();
      a_r_e.style.opacity = opacity2.toString(); 
      progress++;
      }
    }
  } 
    let eventTYPE = "<p id=\""+index.toString()+"\">    <b>CAT!@#</b> FEED THE CAT <input type=\"checkbox\" id=\"check"+index.toString()+"\"><span class=\"cbox\"></span></p>";
    data += eventTYPE;
    for(let i=0;i<index;i++) {
      let id = "check"+i.toString();
      let checkbox = document.getElementById(id);
      if(checkbox.checked == true) {
        checktable[i] = 1;
      }
      else checktable[i] = 0;
    }
    list.innerHTML = data;
    for(let i=0;i<index;i++) {
      let id = "check"+i.toString();
      let checkbox = document.getElementById(id);
      if(checktable[i] == 1) {
        checkbox.checked = true;
      }
    } 
    let id = index.toString();
    document.getElementById(id).style.color = "red";
    index++;
    }
  }
}

document.getElementById("clear").onclick = function clear(){
  count++;
  let anim = document.getElementById("cattail");
  if(count==1)
  {
  let happened = 0;
  let l_e = document.getElementById("eL");
  let h_l_e = document.getElementById("heL");
  let r_e = document.getElementById("eR");
  let h_r_e = document.getElementById("heR");
  let progress = 0;
  let opacity1 = 1;
  let opacity2 = 0;
  let nextstep = 0;
  for(let i=0;i<index;i++) {
      let id = "check"+i.toString();
      let checkbox = document.getElementById(id);
      if(checkbox.checked == true) {
        checktable[i] = 1;
      }
      else checktable[i] = 0;
    }
  for(let i=0;i<index;i++) {
      let id = i.toString();
      let elem = document.getElementById(id);
      if(checktable[i] == 1) {
      elem.style.display = "none";
      if(elem.innerHTML.includes("CAT!@#") &&                 elem.innerHTML.includes("FEED THE CAT"))
        {
          anim.style.animationPlayState = "running";
        }
       happened = 1;
       let check = "check" + i.toString();
       document.getElementById(check).checked = false;
      }
    } 
  if(happened == 1)
  {
  let timer = setInterval(frame, 10);
  function frame() {
    if (progress == 100) {
      clearInterval(timer);
    } else {
      if(progress > 50){
      if(nextstep == 250)
      {
      opacity1 = opacity1 + 0.04;
      opacity2 = opacity2 - 0.02;
      l_e.style.opacity = opacity1.toString();
      r_e.style.opacity = opacity1.toString();
      h_l_e.style.opacity = opacity2.toString();
      h_r_e.style.opacity = opacity2.toString();
      progress++;
      }
      else nextstep++;
      }
      else{
      opacity1 = opacity1 - 0.04;
      opacity2 = opacity2 + 0.02;
      l_e.style.opacity = opacity1.toString();
      r_e.style.opacity = opacity1.toString();
      h_l_e.style.opacity = opacity2.toString();
      h_r_e.style.opacity = opacity2.toString(); 
      progress++;
      }
    }
  }
  }
  }
  setTimeout(function(){ count = 0; }, 3500);
  setTimeout(function(){ anim.style.animationPlayState = "paused"; }, 6000);
}