class QuestionEvent {
  constructor(event, question) {
    this.event = event
    this.question = question
  }
  
  textMessage(resolve) {
    const text = this.event.text
      .replace("{CASTER}", this.event.caster?.name)
      .replace("{TARGET}", this.event.target?.name)
      .replace("{ACTION}", this.event.action?.name)
      .replace("{HERO}", window.playerState.hero.your_name)

    const message = new TextMessage({
      text,
      emotion: this.event.emotion,
      character: this.event.character,
      cb: this.event.cb,
      onComplete: () => {
        resolve()
      }
    })
    message.init( this.question.element )
  }

  async stateChange(resolve) {
    const {caster, target, damage, recover, status } = this.event
    let who = this.event.onCaster ? caster : target

    if (damage) {
      target.update({
        hp: target.hp - damage
      })
    }

    if (recover) {
      let newHp = who.hp + recover
      if (newHp > who.maxHp) newHp = who.maxHp
      who.update({
        hp: newHp
      })
    }

    if (status) {
      who.update({
        status: {...status}
      })
    }
    if (status === null) {
      who.update({
        status: null
      })
    }

    await utils.wait(600)

    this.question.playerTeam.update()
    this.question.enemyTeam.update()
    resolve()
  }

  submissionMenu(resolve) {
    const {caster} = this.event
    const menu = new SubmissionMenu({
      caster: caster,
      enemy: this.event.enemy,
      items: this.question.items,
      replacements: Object.values(this.question.combatants).filter(c => {
        return c.id !== caster.id && c.team === caster.team && c.hp > 0
      }),
      onComplete: submission => {
        resolve(submission)
      }
    })
    menu.init( this.question.element )
  }

  replacementMenu(resolve) {
    const menu = new ReplacementMenu({
      replacements: Object.values(this.question.combatants).filter(c => 
        c.team === this.event.team && c.hp > 0
      ),
      onComplete: replacement => resolve(replacement)
    })
    menu.init( this.question.element )
  }

  async replace(resolve) {
    const {replacement} = this.event
    const prevCombatant = this.question.combatants[this.question.activeCombatants[replacement.team]]
    this.question.activeCombatants[replacement.team] = null
    prevCombatant.update()
    await utils.wait(400)

    this.question.activeCombatants[replacement.team] = replacement.id
    replacement.update()
    await utils.wait(400)

    this.question.playerTeam.update()
    this.question.enemyTeam.update()

    resolve()
  }

  addStoryFlag(resolve) {
    window.playerState.storyFlags[this.event.flag] = true
    if (this.event.upSkill) 
      playerState.addSkill(this.event.upSkill) 
    resolve()
  }

  giveXp(resolve) {
    let amount = this.event.xp
    const {combatant} = this.event
    const step = () => {
      if (amount > 0) {
        amount -= 1
        combatant.xp += 1
        if (combatant.xp === combatant.maxXp) {
          combatant.xp = 0
          combatant.maxXp = 100
        }

        combatant.update()
        requestAnimationFrame(step)
        return
      }
      resolve()
    }
    requestAnimationFrame(step)
  }

  animation(resolve) {
    const fn = QuestionAnimations[this.event.animation]
    fn(this.event, resolve)
  }

  init(resolve) {
    this[this.event.type](resolve)
  }
}
