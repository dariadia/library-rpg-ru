class MobileKeyboard {
  constructor() {
    this.container = document.querySelector(".game-container")
  }
  createElement() {
    this.escButton = document.createElement("button")
    this.escButton.classList.add("EscButton")
    this.escButton.id = "escape"
    this.container.appendChild(this.escButton)
    this.escButton.innerHTML = "settings"

    this.okButton = document.createElement("button")
    this.okButton.classList.add("MobileKey", "enter")
    this.okButton.id = "enter"
    this.okButton.innerHTML = "ok"

    this.element = document.createElement("div")
    this.element.classList.add("MobileKeyboard")
    this.element.innerHTML = `
    <button id="left" class="MobileKey left">➤</button>
    <button id="right" class="MobileKey right">➤</button>
    <button id="up" class="MobileKey up">➤</button>
    <button id="down" class="MobileKey down">➤</button>`
    this.element.appendChild(this.okButton)
    this.show()
  }
  hide() {
    this.element.remove()
    this.escButton.remove()
  }
  show() {
    this.container.appendChild(this.element)
    this.container.appendChild(this.escButton)
  }
  init() {
    document.querySelector(".how-to-play").remove()
    this.container.id = "mobile"
    this.createElement()
  }
}
