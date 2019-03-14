let doc = $(document), mX = doc.width()/2, mY = doc.height()/2+120/1.3
let fire = [], bound = [doc.width()/2, doc.height()/2, 90, 120]

mR = (n, i) => Math.floor(Math.random() * n) + i

inject = () => { 
  $("body").append("<canvas></canvas>")
  can = document.querySelector("canvas")
  con = can.getContext("2d")
  init()
}

size = () => {
  can.height = doc.height()
  can.width = doc.width()
}
$(window).on("resize", () => { size() })

init = () => {
  size()
  think()
}

doc.on("mousemove", (e) => {
  mX = e.pageX
  mY = e.pageY
})

genFire = () => {
  for (let i = fire.length; i < doc.width()/6; i++) {
    fire.push([mR(bound[2]/3, bound[0]+bound[2]/3), mR(bound[3], bound[1]), -Math.random(10)/100 + 1, Math.random(), mR(5, 1)])
  }
}

think = () => {
  bound[0] = mX-bound[2]/2
  bound[1] = mY-bound[3]/1.2
  for (let i = 0; i < fire.length; i++) {
    fire[i][0] > bound[0]+bound[2]/2 && fire[i][1] > bound[1]+bound[3]/3 ? fire[i][0]+= 0.3: fire[i][0]-= 0.4
    fire[i][0] < bound[0]+bound[2]/2 && fire[i][1] > bound[1]+bound[3]/3 ? fire[i][0]-= 0.3: fire[i][0]+= 0.4
    fire[i][3]-= 0.01
    fire[i][1]*= fire[i][2]
    fire[i][1] <= 0 || fire[i][3] <= 0 ? fire.splice(i, 1): null
  }
  genFire()
  animate()
  window.requestAnimationFrame(think)
}

animate = () => {
  con.clearRect(0, 0, can.width, can.height)
  for (let i = 0; i < fire.length; i++) {
    dC(fire[i][0], fire[i][1], fire[i][4], fire[i][3])
  }
}

dC = (x, y, s, c) => {
  let rC = ["rgba(255, 0, 0, "+c+")", "rgba(255, 69, 0, "+c+")", "rgba(255, 140, 0, "+c+")"]
  con.beginPath()
  con.save()
  con.shadowColor = rC[mR(rC.length, 0)]
  con.shadowBlur = s/2
  con.fillStyle = rC[mR(rC.length, 0)]
  con.arc(x, y, s, 0, Math.PI*2, true)
  con.fill()
  con.restore()
}

doc.ready(() => { inject() })