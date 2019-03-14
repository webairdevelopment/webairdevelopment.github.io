const keys = document.getElementById("keys");
const keyholder = document.getElementById("keyborder");
const note = document.getElementById("note");
const notes = ["c1", "c1s", "d1", "d1s", "e1",  "f1", "f1s", "g1", "g1s", "a1", "a1s", "b1", "c2"];
const BLACK = "black";
const KEY = "key";


notes.forEach(note => {
  let classname = note.includes("s") ? BLACK : KEY;
  let element = document.createElement("div"); 
  element.classList.add(classname, "note");
  element.dataset.keynote = note;
  element.style.paddingBottom = `${getRandomHeight(classname)}%`;
  keys.appendChild(element);
})

keys.addEventListener("click", (e) => {
  e.stopPropagation();
  const currentNote = e.target.dataset.keynote;
  note.textContent = currentNote.toUpperCase();
  const key = new Audio(`https://raw.githubusercontent.com/pffy/mp3-piano-sound/master/mp3/${currentNote}.mp3`);
  key.play();
})

function assignRandomHeight(event) {
  for(let e in keys.children) {
    let element = keys.children[e];
    if(element.classList) {
      element.style.paddingBottom = `${getRandomHeight(element.classList[0])}%`;
    }
  }
}

function getRandomHeight (key) {
  let max = key === BLACK ? 30 : 60;
  let min = key === BLACK ? 10 : 40;
  
  return Math.floor(Math.random() * (max - min + 1) + min);
}

keyholder.addEventListener("click", assignRandomHeight);