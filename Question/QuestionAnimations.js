window.QuestionAnimations = {
  async spin(event, onComplete) {
    const element = event.caster.skillElement
    const animationClassName = event.caster.team === "player" ? "question-spin-right" : "question-spin-left"
    element.classList.add(animationClassName)
    element.addEventListener("animationend", () => {
      element.classList.remove(animationClassName)
    }, { once:true })
    await utils.wait(100)
    onComplete()
  },

  async glob(event, onComplete) {
    const {caster} = event
    let div = document.createElement("div")
    div.classList.add("glob-orb")
    div.classList.add(caster.team === "player" ? "question-glob-right" : "question-glob-left")

    div.innerHTML = (`
      <svg viewBox="0 0 32 32" width="32" height="32">
        <circle cx="16" cy="16" r="16" fill="${event.color}" />
      </svg>
    `)
    div.addEventListener("animationend", () => {
      div.remove()
    })
    document.querySelector(".Question").appendChild(div)

    await utils.wait(820)
    onComplete()
  },

  async move(event, onComplete) {
    const { caster, direction } = event
    const casterClass = caster.team === "player" ? ".Question_hero" : ".Question_enemy"
    const movingClass = direction === 'forward' ? "walking-forward" : "walking-back"
    const div = document.querySelector(casterClass)
    div.classList.add(movingClass)
    const animate = () => {
      div.classList.remove("walking-forward", "walking-back")
    }

    if (direction === 'backward') {
      div.addEventListener("animationend", animate)
    }

    await utils.wait(820)
    div.removeEventListener("animationend", animate);
    onComplete()
  }
}
