class Prompt {
  constructor({ options, map, onComplete, withBackOption }) {
    this.options = options
    this.onComplete = onComplete
    this.element = null
    this.withBackOption = withBackOption
    this.map = map
  }

  async menuSubmit(actions = []) {
    this.keyboardMenu?.end()
    for (let i=0; i<actions.length; i++) {
      const eventHandler = new OverworldEvent({
        event: actions[i],
        map: this.map,
      })
      await eventHandler.init()
    }

    this.onComplete()
    this.done()
  }

  getOptions() {
    const backOption = {
      label: "Go Back",
      description: "Return to previous page",
      handler: () => {
        this.keyboardMenu.setOptions(this.getPages())
      }
    };
    let options = this.options.map(option => ({
      label: option.text,
      description: `Choose what to do: ${option.text}`,
      handler: () => {
        this.menuSubmit(option.actions)
      }
    }))

    if (this.withBackOption) options.push(backOption)

    return options
  }

  createActionsMenu(container) {
    this.element = document.createElement("div")
    this.element.classList.add("Prompt_actions")
    this.keyboardMenu = new KeyboardMenu({}, true);
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions())
    container.appendChild(this.element)
  }

  done() {
    this.element.remove()
    this.onComplete()
  }

  init(container) {
    this.createActionsMenu(container)
    container.appendChild(this.element)
  }
}
