const width = window.innerWidth
const height = window.innerHeight - 10

// Create SVG
const canvas = SVG().addTo('body')
  .size(width, height)
  .viewbox(0, 0, width, height)

// Have some text as call to action
canvas.text('Just Click IT')
  .font({size: 25})
  .move(20, 20)

// This is our template which we will clone later
const gradient = canvas.gradient('radial', (add) => {
  // If you want try to change the colors or offsets
  add.stop(0, '#01addd', 0)
  add.stop(0.0025, '#01addd', 0.5)
  add.stop(0.005, '#eeeeee', 0.5)
  add.stop(0.010, '#039ad3', 0.5)
  add.stop(0.015, '#eeeeee', 0.5)
  add.stop(0.0175, '#eeeeee', 0)
})

canvas.on('click', (e) => {
  // Convert mouse coordinates into canvas coordinates
  const {x, y} = canvas.point(e.clientX, e.clientY)

  drawAndAnimate(x, y)

  // You want an echo? Uncomment this!
  // setTimeout(() => drawAndAnimate(x, y), 200)
  // setTimeout(() => drawAndAnimate(x, y), 400)
})


const drawAndAnimate = (x, y) => {
  // Clone gradient and create rect with gradient
  const grad = gradient.clone().insertAfter(gradient)
  const rect = canvas.rect(width, height)
    .center(x, y)
    .fill(grad)

  // Create List of all stops in gradient and
  // create runner for each with easing set to linear
  const stops = grad.children()
    .animate(10000)
    .ease('-')

  // We update every stop explicitely
  // no need for fancy math here
  stops[0].update(0.985)
  stops[1].update(0.9875)
  stops[2].update(0.990)
  stops[3].update(0.995)
  stops[4].update(0.9975)
  stops[5].update(1)

  // Start fading out the whole thing after 3 sec
  // delay and remove rect and gradient in the end
  rect.animate(7000, 3000)
    .opacity(0)
    .after(() => {
      rect.remove()
      grad.remove()
    })
}