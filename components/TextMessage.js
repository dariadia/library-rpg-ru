const HERR_DOKTOR_PHRASES = []

const getRandomPhrase = (character) => {
  switch (character) {
    case [HERR_DOKTOR]: {
      return HERR_DOKTOR_PHRASES[Math.floor(Math.random() * (HERR_DOKTOR_PHRASES.length))] 
    }
  }
}

class TextMessage {
  constructor({ text, character, onComplete, sayRandom }) {
    this.text = text
    this.character = character
    this.onComplete = onComplete
    this.element = null
    this.sayRandom = sayRandom
  }

  createElement() {
    this.element = document.createElement("div")
    this.element.classList.add("TextMessage")

    this.element.innerHTML = (`
      <p class="TextMessage_p"></p>
      <button class="TextMessage_button">Next</button>
    `)

    if (this.character) {
      const characterBox = document.createElement("div")
      characterBox.classList.add("TextMessage_character")
      characterBox.innerHTML = `<div class="TextMessage_character-name">${this.character?.name}<img class="TextMessage_character-avatar" src="${this.character?.avatar}" alt="${this.character?.name} speaking" /></div>`

      this.element.insertBefore(characterBox, this.element.firstChild)
    }

    this.revealingText = new RevealingText({
      element: this.element.querySelector(".TextMessage_p"),
      text: this.sayRandom ? getRandomPhrase(this.character.id) : this.text
    })

    this.element.querySelector("button").addEventListener("click", () => {
      this.done()
    })

    this.actionListener = new KeyPressListener("Enter", () => {
      this.done()
    })
  }

  done() {
    if (this.revealingText.isDone) {
      this.element.remove()
      this.actionListener.unbind()
      this.onComplete()
    } else this.revealingText.warpToDone()
  }

  init(container) {
    this.createElement()
    container.appendChild(this.element)
    this.revealingText.init()
  }
}
