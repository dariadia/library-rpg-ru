class OverworldEvent {
  constructor({ map, event}) {
    this.map = map
    this.event = event
  }

  stand(resolve) {
    const who = this.map.gameObjects[ this.event.who ]
    who.startBehavior({
      map: this.map
    }, {
      type: "stand",
      direction: this.event.direction,
      time: this.event.time
    })
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler)
        resolve()
      }
    }
    document.addEventListener("PersonStandComplete", completeHandler)
  }

  walk(resolve) {
    const who = this.map.gameObjects[ this.event.who ]
    who.startBehavior({
      map: this.map
    }, {
      type: "walk",
      direction: this.event.direction,
      retry: true
    })
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler)
        resolve()
      }
    }
    document.addEventListener("PersonWalkingComplete", completeHandler)
  }

  externalEffect(resolve) {
    const container = document.querySelector(".game-container")
    const effectElement = document.createElement("div")
    effectElement.classList.add("ExternalEffect", this.event.kind)
    container.appendChild(effectElement)
    setTimeout(() => {
      effectElement.remove()
    }, this.event.time || 1000)
    resolve()
  }

  textMessage(resolve) {

    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero]
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction)
    }

    const message = new TextMessage({
      text: this.event.text,
      character: this.event.character,
      sayRandom: this.event.sayRandom,
      onComplete: () => resolve()
    })
    message.init( document.querySelector(".game-container") )
  }

  prompt(resolve) {
    const prompt = new Prompt({
      options: this.event.options,
      onComplete: () => resolve(),
      map: this.map,
      withBackOption: this.event.withBackOption,
    })
    prompt.init( document.querySelector(".game-container") )
  }

  changeMap(resolve) {
    Object.values(this.map.gameObjects).forEach(obj => {
      obj.isMounted = false
    })

    const sceneTransition = new SceneTransition({ lowShade: this.event.disappear, shadeOptions: this.event.shadeOptions })
    sceneTransition.init(document.querySelector(".game-container"), () => {
      this.map.overworld.startMap( window.OverworldMaps[this.event.map], {
        x: this.event.x,
        y: this.event.y,
        direction: this.event.direction,
      })
      resolve()
      sceneTransition.fadeOut()
    })
  }

  battle(resolve) {
    const battle = new Battle({
      enemy: Enemies[this.event.enemyId],
      arena: this.event.arena || null,
      onComplete: (didWin) => {
        resolve(didWin ? "WON_BATTLE" : "LOST_BATTLE")
      }
    })
    battle.init(document.querySelector(".game-container"))

  }

  pause(resolve) {
    this.map.isPaused = true
    const menu = new PauseMenu({
      progress: this.map.overworld.progress,
      onComplete: () => {
        resolve()
        this.map.isPaused = false
        this.map.overworld.startGameLoop()
      }
    })
    menu.init(document.querySelector(".game-container"))
  }

  addStoryFlag(resolve) {
    window.playerState.storyFlags[this.event.flag] = true
    resolve()
  }

  craftingMenu(resolve) {
    const menu = new CraftingMenu({
      pizzas: this.event.pizzas,
      onComplete: () => {
        resolve()
      }
    })
    menu.init(document.querySelector(".game-container"))
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)      
    })
  }

}
