
// Pull out some function from Math
// which we need later
const { min, floor, sqrt, abs, random, cos, sin, acos } = Math

// Define gravity ;)
const GRAVITY = -9.81

// Define a width and height for the scene
const width = 1000
const height = 600

// Create canvas, set size and viewbox
const canvas = SVG()
  .addTo('body')
  .size(window.innerWidth, window.innerHeight - 10)
  .viewbox(0, 0, width, height)

// We flip the whole playing field
// Today we want y=0 to be at the bottom
const playground = canvas.group()
  .flip('y', height / 2)

// Create a mask which holds all collisions which happened
const collisions = canvas.mask()
collisions.rect(width, height).fill('#fff')

// Create a group for all buildings
// and mask the with the collisions
const buildings = playground.group()
  .maskWith(collisions)

// Function which generates buildings
const build = () => {
  // Clear the group
  buildings.clear()

  // Create rectangles
  let sum = 0
  while (width > sum) {

    let rectWidth = floor(50 + random() * 100)
    let rectHeight = floor(100 + random() * 400)

    if (width - sum - rectWidth < 50) {
      rectWidth = width - sum
    }

    buildings.rect(rectWidth, rectHeight)
      .move(sum, 0)
      .fill(SVG.Color.random())

    sum += rectWidth
  }
}

// Create wind speed
let wind = Math.random() - 0.5

// Create a group for the wind display
let windGroup = playground.group()

// Function to create all wind elements
const displayWind = () => {
  // Clear the group
  windGroup.clear()

  // Draw the border and the background
  windGroup.rect(100, 25)
    .center(width / 2, height - 25)
    .stroke('black')

  windGroup.rect(100, 25)
    .center(width / 2, height - 25)
    .fill('#fff')

  // Create wind bar
  let absWind = abs(wind) * 100
  windGroup.rect(absWind, 25)
    .x(wind < 0 ? width / 2 - absWind : width / 2)
    .cy(height - 25)
    .fill('#00bcff')
}

// Create group for players
let players = playground.group()
let player1
let player2

// Function to draw the players
const drawPlayers = () => {
  // Clear group
  players.clear()

  // Create two circles which act as players
  player1 = players.circle({ r: 25 })
    .fill(SVG.Color.random())
  player2 = players.circle({ r: 25 })
    .fill(SVG.Color.random())

  const list = buildings.children()

  // decide on which building the player goes
  const buildingLeft = list[floor(random() * 3)]
  const buildingRight = list[list.length - 1 - floor(random() * 3)]

  const { cx: x1, y2: y1 } = buildingLeft.bbox()
  const { cx: x2, y2 } = buildingRight.bbox()

  // move players on top of the chosen buildings
  player1.center(x1, y1)
  player2.center(x2, y2)

  // Give playrs a text
  // (flip it again so we can read it)
  players.text('P1')
    .font({ size: 10 })
    .center(x1, y1)
    .flip('y', y1)

  players.text('P2')
    .font({ size: 10 })
    .center(x2, y2)
    .flip('y', y2)
}

// Function to check if a player was hit
const playerHit = (x, y, player) => player.inside(x, y)

// Function to check if an obstacle was hit
// Thats the most simple collision detection ever written
// DONT TALK IT DOWN!!!! :P
const collision = (x, y) => {
  // If we are below earth: collision
  if (y < 0) return true
  // If we left the playing field: collision
  if (x < -1000 || x > width + 1000)
    return true

  // If we are in a part of the building
  // which is already destroyed
  // we do NOT have a collision
  if (collisions.find('circle').inside(x, y).some(el => el))
    return false

  // If we are in a building: collision
  return buildings.children().inside(x, y).some(el => el)
}

// Gradient for the explosion
const boomGradient = canvas.gradient('radial', (add) => {
  add.stop(0, '#f6f197')
  add.stop(0.25, '#f6e764')
  add.stop(0.5, '#f6c729')
  add.stop(0.75, '#f59e21')
  add.stop(1, '#f26924')
})

// Create group which holds all the dots
// that show the path of the bullet
const dots = playground.group()
  .insertBefore(players)

// Function to shoot a bullet
const shoot = (vx0, vy0, player) => {
  // Clear all dots
  dots.clear()

  // Get start point of bullet
  const { cx: x0, cy: y0 } = player.bbox()
  const ball = dots.circle({ r: 5 }).center(x0, y0)

  const otherPlayer = player === player1
    ? player2
    : player1

  // Animate the ball with given start velocity
  const start = performance.now()
  const animate = now => {
    const t = now - start

    const ax = wind / 1000
    const ay = GRAVITY / 10000

    // Thats the basic formula
    // for static accelleration
    const x = x0 + vx0 * t + ax / 2 * t ** 2
    const y = y0 + vy0 * t + ay / 2 * t ** 2

    // Move the bullet and draw a dot
    ball.center(x, y)
    dots.circle({ r: 2 })
      .center(x, y)
      .fill('#ccc')

    // Check if a player was hit
    if (playerHit(x, y, otherPlayer)) {
      // Finish the game
      return finish(player, otherPlayer)
    }

    // Did we collide with an obstactle?
    if (collision(x, y)) {
      // Reove the ball, add explosion to mask
      ball.remove()
      collisions.circle({ r: 50 }).center(x, y)

      // Create gradient and animate it
      let boomCircle = playground.circle({ r: 50 })
        .center(x, y)
        .fill(boomGradient)
      boomCircle.animate()
        .size(0, 0)
        .after(() => boomCircle.remove())

      // Start the next turn
      return nextTurn(otherPlayer)
    }

    // Request next frame
    SVG.Animator.frame(() => {
      animate(performance.now())
    })
  }

  // Start the animation
  animate(performance.now())
}

// Calculates the length of a vector
const vecLength = (x, y) => sqrt(x * x + y * y)

// Calculates the angle between two vectors
const angle = (v1, v2) => acos(
  (v1[0] * v2[0] + v1[1] * v2[1])
  / (vecLength(...v1) * vecLength(...v2))
) * (v2[1] - v1[1] < 0 ? -1 : 1)

// Create a vector from a length and an angle
const vecFromLength = (angle, len) =>
  [len * cos(angle), len * sin(angle)]

// Gradient for the fire indicator
const fireGradient = canvas.gradient('linear', (add) => {
  add.stop(0, '#f6f197')
  add.stop(0.25, '#f6e764')
  add.stop(0.5, '#f6c729')
  add.stop(0.75, '#f59e21')
  add.stop(1, '#f26924')
})

// Function which adds the aiming indicator
const aim = player => {
  // The indicator is a simple rectangle
  let rect = playground.rect(0, 5)
    .insertBefore(players)

  // Update the indicator on every mouse move
  SVG.on(document, 'mousemove.aim', (e) => {
    const { x, y } = playground.point(e.pageX, e.pageY)
    const { cx, cy } = player.bbox()

    // Calculate the rotation
    // and length of the indicator
    const absVal = vecLength(x - cx, y - cy)
    const a = angle(
      [1, 0],
      [x - cx, y - cy]
    ) * 180 / Math.PI

    // Manipulate rectangle accordingly
    rect.x(cx).cy(cy)
      .width(min(absVal, 200))
      .fill(fireGradient)
      .transform({ rotate: a, origin: [cx, cy] })
  })

  // Shoot on click
  SVG.on(document, 'click.aim', (e) => {
    // Remove all events of the aim namespace
    SVG.off(document, '.aim')

    // Remove the indicator
    rect.remove()

    const { x, y } = playground.point(e.pageX, e.pageY)
    const { cx, cy } = player.bbox()

    // Calculate the rotation and length
    // of the velocity vector
    const absVal = vecLength(x - cx, y - cy)
    const a = angle([1, 0], [x - cx, y - cy])

    // Create velocity vector for shooting
    const [vx, vy] = vecFromLength(a, min(absVal, 200))

    // SHOOOT
    // (and normalize with magic numbers - sorry)
    shoot(vx / 150, vy / 150, player)
  })
}

// Gives a player the aiming indicator
const nextTurn = (player) => {
  aim(player)
}

// The group in which the winning text is placed
let winText = playground.group()

// Executed when a player hits the other player
const finish = (player, otherPlayer) => {
  // Clear the winText group
  winText.clear()

  // Text content
  const t = 'Player ' + (player === player1 ? '1' : '2') + ' won!'

  // Create Text and animate its color
  winText.text(t)
    .font('size', 20)
    .center(width / 2, height - 100)
    .flip('y', height - 100)
    .fill(SVG.Color.random())
    .opacity(0)
    .animate()
      .opacity(1)
    .animate().loop(Infinity, true)
      .fill(SVG.Color.random())

  // Restart the game on click
  SVG.on(document, 'click.reset', (e) => {
    SVG.off(document, 'click.reset')
    e.stopPropagation()
    start()
  })
}

// Function that builds the game
const start = () => {
  // Hide WinText and everything
  winText.clear()
  collisions.find('circle').remove()
  dots.clear()

  // Build parts of the game
  wind = Math.random() - 0.5
  build()
  displayWind()
  drawPlayers()

  // Add Start button
  let button = playground.group()
  const text = button.text('Start!')
    .font('size', 30)
    .center(width / 2, height / 2)
    .flip('y', height / 2)

  const { w, h } = text.bbox()
  button.rect(w + 10, h + 10)
    .center(width / 2, height / 2)
    .insertBefore(text).fill('#fff')
    .stroke('#000')

  // Let the first playe aim when the game starts
  button.on('click', (e) => {
    button.hide()
    e.stopPropagation()
    aim(player1)
  })
}

// Initialize the game
start()