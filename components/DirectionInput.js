class DirectionInput {
  constructor() {
    this.heldDirections = []
    this.map = {
      "ArrowUp": "up",
      "KeyW": "up",
      "ArrowDown": "down",
      "KeyS": "down",
      "ArrowLeft": "left",
      "KeyA": "left",
      "ArrowRight": "right",
      "KeyD": "right",
    }
  }

  get direction() {
    return this.heldDirections[0]
  }

  initMobile(target) {
    target.element.addEventListener("touchstart", event => {
      const dir = event.target.id
      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir)
      }
    })
    target.element.addEventListener("touchend", event => {
      const dir = event.target.id
      const index = this.heldDirections.indexOf(dir)
      if (index > -1) {
        this.heldDirections.splice(index, 1)
      }
    })
  }

  initDesktop() {
    document.addEventListener("keydown", event => {
      const dir = this.map[event.code]
      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir)
      }
    })
    document.addEventListener("keyup", event => {
      const dir = this.map[event.code]
      const index = this.heldDirections.indexOf(dir)
      if (index > -1) {
        this.heldDirections.splice(index, 1)
      }
    })
  }

  init() {
    if (window.playerState.mobileKeyboard) 
      this.initMobile(window.playerState.mobileKeyboard)
    else this.initDesktop()
  }
}
