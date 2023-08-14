class CraftingMenu {
  constructor({ skills, onComplete}) {
    this.skills = skills
    this.onComplete = onComplete
  }

  getOptions() {
    return this.skills.map(id => {
      const base = skills[id]
      return {
        label: base.name,
        description: base.description,
        handler: () => {
          playerState.addSkill(id)
          this.close()
        }
      }
    })
  }

  createElement() {
    this.element = document.createElement("div")
    this.element.classList.add("CraftingMenu")
    this.element.classList.add("overlayMenu")
    this.element.innerHTML = (`
      <h2>Up a skill</h2>
    `)
  }

  close() {
    this.keyboardMenu.end()
    this.element.remove()
    this.onComplete()
  }


  init(container) {
    this.createElement()
    this.keyboardMenu = new KeyboardMenu({
      descriptionContainer: container
    })
    this.keyboardMenu.init(this.element)
    this.keyboardMenu.setOptions(this.getOptions())
    container.appendChild(this.element)
  }
}
