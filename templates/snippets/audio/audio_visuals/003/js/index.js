const q = (query) => document.querySelector(query);
const track = 'audio/drumsbase.wav'
let bars = []
let outerBars = []

function resizeBars() {
  q('#bars').style.width = '100%'
  for (let i = 0; i < outerBars.length; i += 1) {
    outerBars[i].style.width = `${q('#bars').scrollWidth / bars.length}px`
  }
  q('#bars').style.width = '80%'
}

for (let i = 0; i < 600; i += 1) {
  let bar = document.createElement('div')
  bar.setAttribute('class', 'bar')
  let barInner = document.createElement('div')
  barInner.setAttribute('class', 'bar-inner')
  bar.appendChild(barInner)
  q('#bars').appendChild(bar)
  bars.push(barInner)
  outerBars.push(bar)
}

resizeBars();

q('#start').addEventListener('click', () => {
  q('#bars').style.display = 'block'
  q('#start').style.opacity = 0
  setTimeout(() => {
    q('#subtext').innerText = ''
    q('#play-me').innerText = 'Say Something Special'
    q('#start').style.opacity = 1
  }, 1000)
  const audio = q('#audio')
  const ctx = new AudioContext()
  const analyser = new AnalyserNode(ctx)
  const source = ctx.createMediaElementSource(audio)
  source.connect(analyser)
  analyser.connect(ctx.destination)
  audio.setAttribute('src', track)
  audio.play()
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  
  resizeBars()
  
  setInterval(() => {
    analyser.getByteFrequencyData(frequencyData)
    const copyData = frequencyData.slice(0, 600)
    
    for (let i = 0; i < bars.length; i += 1) {
      let bar = bars[i]
      if (!bar) break;
      let height = `${((copyData[copyData.length - i - 1] / 255) * 100) - 1}%`
      bar.style.height = height
    }
  }, 10)
});

window.addEventListener('resize', resizeBars)