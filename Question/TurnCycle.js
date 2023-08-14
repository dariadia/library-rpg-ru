class TurnCycle {
  constructor({ question, onNewEvent, onWinner }) {
    this.question = question
    this.onNewEvent = onNewEvent
    this.onWinner = onWinner
    this.currentTeam = "player"
  }

  async turn() {
    const casterId = this.question.activeCombatants[this.currentTeam]
    const caster = this.question.combatants[casterId]
    const enemyId = this.question.activeCombatants[caster.team === "player" ? "enemy" : "player"]
    const enemy = this.question.combatants[enemyId]

    const submission = await this.onNewEvent({
      type: "submissionMenu",
      caster,
      enemy
    })
    if (submission.replacement) {
      await this.onNewEvent({
        type: "replace",
        replacement: submission.replacement
      })
      await this.onNewEvent({
        type: "textMessage",
        text: `Go get 'em, ${submission.replacement.name}!`
      })
      this.nextTurn()
      return
    }

    if (submission.instanceId) {
      this.question.usedInstanceIds[submission.instanceId] = true
      this.question.items = this.question.items.filter(i => i.instanceId !== submission.instanceId)
    }

    const resultingEvents = caster.getReplacedEvents(submission.action.success)

    for (let i=0; i<resultingEvents.length; i++) {
      const event = {
        ...resultingEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      }
      await this.onNewEvent(event)
    }
    const targetDead = submission.target.hp <= 0
    if (targetDead) {
      await this.onNewEvent({ 
        type: "textMessage", text: `${submission.target.name} gives in!`
      })

      if (submission.target.team === "enemy") {

        const playerActiveSkillId = this.question.activeCombatants.player
        const xp = 10

        await this.onNewEvent({
          type: "giveXp",
          xp,
          combatant: this.question.combatants[playerActiveSkillId]
        })
      }
    }

    const winner = this.getWinningTeam()
    if (winner) return this.onWinner(winner)
 
    if (targetDead) {
      const replacement = await this.onNewEvent({
        type: "replacementMenu",
        team: submission.target.team
      })
      await this.onNewEvent({
        type: "replace",
        replacement: replacement
      })
      await this.onNewEvent({
        type: "textMessage",
        text: `${replacement.name} appears!`
      })
    }

    const postEvents = caster.getPostEvents()
    for (let i=0; i < postEvents.length; i++ ) {
      const event = {
        ...postEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target, 
      }
      await this.onNewEvent(event)
    }

    const expiredEvent = caster.decrementStatus()
    if (expiredEvent) {
      await this.onNewEvent(expiredEvent)
    }

    this.nextTurn()
  }

  nextTurn() {
    this.currentTeam = this.currentTeam === "player" ? "enemy" : "player"
    this.turn()
  }

  getWinningTeam() {
    let aliveTeams = {}
    Object.values(this.question.combatants).forEach(c => {
      if (c.hp > 0) {
        aliveTeams[c.team] = true
      }
    })
    if (!aliveTeams["player"]) { return "enemy"}
    if (!aliveTeams["enemy"]) { return "player"}
    return null
  }

  async init() {
    await this.onNewEvent({
      type: "textMessage",
      text: `You approach ${this.question.enemy.name}!`,
      caster: { name: "You" }
    })
    this.turn()

  }

}
