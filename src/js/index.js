import '../css/index.css'

const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext('2d')

class Circle {
  constructor () {
    this.r = Math.round(Math.random() * 2)
    this.x = Math.random() * (window.innerWidth - this.r * 2) + this.r
    this.y = Math.random() * (window.innerHeight - this.r * 2) + this.r
    this.dx = Math.random() * 2
    this.dy = Math.random() * 2
    this.originR = this.r
    this.color = this.generateColor
    this.originColor = this.color
    this.smallColor = 'transparent'
  }

  get generateColor () {
    const colorArray = []
    for (let i = 0; i <= 2; i += 1) {
      const randomInt = Math.round(Math.random() * 255)
      colorArray.push(randomInt)
    }
    const colorArrayString = colorArray.join(', ')
    const rgb = `rgb(${colorArrayString})`
    return rgb
  }

  draw () {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
  }

  animate () {
    this.color = this.smallColor
    this.x += this.dx
    this.y += this.dy

    // check if collide with boundary
    if (this.x + this.r > window.innerWidth || this.x - this.r < 0) {
      this.dx = -this.dx
    }
    if (this.y + this.r > window.innerHeight || this.y - this.r < 0) {
      this.dy = -this.dy
    }

    // check if near mouse position
    if (checkMouse(this.x, this.y, this.r)) {
      // if near house fill color and grow
      this.color = this.originColor
      if (this.r < 50) {
        // limit the grow size
        this.r += 1
      }
    } else if (this.r > this.originR) {
      // if didn't shrink to original size still fill color
      this.color = this.originColor
      if (this.r === this.originR + 1) {
        // if shrink to original size, take off the color
        this.color = this.smallColor
      }
      this.r -= 1
    }

    this.draw()
  }
}

const mousePos = {
  x: 0,
  y: 0
}

let circles = []

function initCanvas () {
  circles = []
  for (let i = 0; i < window.innerWidth; i += 1) {
    const circle = new Circle()
    circles.push(circle)
  }
}

initCanvas()

function drawCanvas () {
  requestAnimationFrame(drawCanvas)
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  circles.forEach(item => {
    item.animate()
  })
}

drawCanvas()

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  initCanvas()
})

function checkMouse (x, y, r) {
  const distX = Math.pow(x - mousePos.x, 2)
  const distY = Math.pow(y - mousePos.y, 2)
  const dist = Math.sqrt(distX + distY)
  if (dist < 50) {
    return true
  }
  return false
}

const mouseListener = (e) => {
  mousePos.x = e.x
  mousePos.y = e.y
}
window.addEventListener('mousemove', mouseListener)
