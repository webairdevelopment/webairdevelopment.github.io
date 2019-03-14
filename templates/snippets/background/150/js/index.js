/************************************
  This codepen is part of the svg.js
  advent calendar. You can find all
  the pens at twitter: @svg_js
*************************************/

const width = window.innerWidth
const height = window.innerHeight - 10

// Create SVG and set viewbox
// so that we zoom into the center
const canvas = SVG()
  .addTo('body')
  .size(width, height)
  .viewbox(-width/8, -height/8, width/4, height/4)

// Big circle
canvas.circle(80)
   .center(0,0)
    .fill('none')
    .stroke({
      width: 1,
      color: SVG.Color.random()
    })

// Hours line
const hour = canvas.line(0, 0, 0, -20)
  .stroke(SVG.Color.random())
  .animate(new SVG.Spring(400, 20))

// Minutes line
const min = canvas.line(0, 0, 0, -30)
  .stroke(SVG.Color.random())
  .animate(new SVG.Spring(400, 20))

// Seconds line
const sec = canvas.line(0, 0, 0, -38)
  .stroke(SVG.Color.random())
  .animate(new SVG.Spring(400, 20))


const update = () => {
  // Get time
  const d = new Date()
  let h = d.getHours()
  let m = d.getMinutes()
  let s = d.getSeconds()
  
  // Make sure we see partial hours
  h += m/60
  
  // Calculate angle
  const hAngle = h/24 * 360
  const mAngle = m/60 * 360
  const sAngle = s/60 * 360
  
  // Rotate
  hour.transform({rotate: hAngle, origin: [0, 0]})
  min.transform({rotate: mAngle, origin: [0, 0]})
  sec.transform({rotate: sAngle, origin: [0, 0]})
 }

setInterval(update, 1000)
update()