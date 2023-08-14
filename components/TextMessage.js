const HERR_DOKTOR_PHRASES = []

const getRandomPhrase = (character) => {
  switch (character) {
    case [HERR_DOKTOR]: {
      return HERR_DOKTOR_PHRASES[Math.floor(Math.random() * (HERR_DOKTOR_PHRASES.length))]
    }
  }
}

class TextMessage {
  constructor({ text, character, onComplete, sayRandom, emotion, cb, effect, effectType }) {
    this.text = text
    this.character = character
    this.onComplete = onComplete
    this.element = null
    this.sayRandom = sayRandom
    this.emotion = emotion
    this.cb = cb
    this.effect = effect
    this.effectType = effectType
  }

  createElement() {
    this.element = document.createElement("div")
    this.element.classList.add("TextMessage")

    if (this.effect) {
      this.effectParent = document.createElement("div")
      this.effectParent.classList.add("TextMessage_effect", this.effect)
    }
    if (this.effectType) this.effectParent.classList.add(this.effectType)

    this.element.innerHTML = (`
      <p class="TextMessage_p"></p>
      <button class="TextMessage_button">Next</button>
    `)

    if (this.character) {
      const characterBox = document.createElement("div")
      characterBox.classList.add("TextMessage_character")
      characterBox.innerHTML = `<div class="TextMessage_character-name">${this.character?.name}<img class="TextMessage_character-avatar" src="${this.character?.avatar[this.emotion || 'gen']}" alt="${this.character?.name} speaking" /></div>`

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
      if (this.effectParent) this.effectParent.remove()
      else this.element.remove()
      this.actionListener.unbind()
      if (this.cb) this.cb()
      this.onComplete()
    } else this.revealingText.warpToDone()
  }

  init(container) {
    this.createElement()
    if (this.effectParent) {
      this.effectParent.appendChild(this.element)
      container.appendChild(this.effectParent)
    } else container.appendChild(this.element)
    this.revealingText.init()
  }
}
