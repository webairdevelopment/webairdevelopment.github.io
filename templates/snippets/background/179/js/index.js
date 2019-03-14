const can = document.querySelector("canvas")
const con = can.getContext("2d")

let o = [], mX, mY, erase = false, trail = false

size = () => {
  dW = $(document).width()
  dH = $(document).height()
  can.height = dH
  can.width = dW
}
size()

$(window).on("resize", () => size())
$(document).on("mousedown", () => erase = true)
$(document).on("mouseup" , () => erase = false)
$(document).on("dblclick", () => cC())
$(document).on("keypress", (e) => {
  e.which == 32 || e.key == 32 ? trail == true ? trail = false: trail = true: null
})
$(".e").on("click", () => $(".controls").fadeOut(500))


             
cC = () => con.clearRect(0, 0, can.width, can.height)
mR = (n, i) => Math.floor(Math.random() * n) + i
rO = () => Math.cos(Math.PI * Math.round(Math.random()))

let rC = [
  [26, 188, 156],
  [46, 204, 113],
  [52, 152, 219],
  [155, 89, 182],
  [241, 196, 15],
  [230, 126, 34],
  [231, 76, 60]
]

$(document).on("mousemove", (e) => {
  mX = e.pageX
  mY = e.pageY
  let s = mR(rC.length, 0)
  if (erase == false) {
    o.push([mX, mY, mR(5, 2), rC[s][0], rC[s][1], rC[s][2], 1, "black"])
  } else {
    o.push([mX, mY, mR(5, 2), 26, 26, 26, 1, "#1a1a1a"])
  }
})

for (let i = 0; i < dW/20; i++) {
  let s = mR(rC.length, 0)
  o.push([mR(dW, 1), mR(dH, 1), mR(5, 2), rC[s][0], rC[s][1], rC[s][2], 1, "black"])
}

dC = (x, y, s, r, g, b, a, sc) => {
  con.beginPath()
  con.save()
  con.shadowColor = sc
  con.shadowBlur = s
  con.fillStyle = "rgba("+r+", "+g+", "+b+", "+a+")"
  con.arc(x, y, s, 0, Math.PI*2, true)
  con.fill()
  con.restore()
}

draw = () => {
  trail == true ? cC(): null
  for (let i = 0; i < o.length; i++) {
    o[i][0] += o[i][2] * rO()
    o[i][1] += o[i][2] * rO()
    dC(o[i][0], o[i][1], o[i][2], o[i][3], o[i][4], o[i][5], o[i][6], o[i][7])
    o[0][6] >= 0 ? o[0][6] -= 0.010: o.splice(0, 1)
  }
  window.requestAnimationFrame(draw)
}

console.log("If you find this, drop a follow :)")

draw()