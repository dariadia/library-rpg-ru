class PlayerState {
  constructor() {
    this.skills = {}
    this.lineup = []
    this.items = [
      { actionId: "item_recoverHp", instanceId: "item1" },
      { actionId: "item_recoverHp", instanceId: "item2" },
      { actionId: "item_recoverHp", instanceId: "item3" },
    ]
    this.storyFlags = {}
    this.clues = 0
  }

  addSkill(skillId) {
    const newId = `p${Date.now()}`+Math.floor(Math.random() * 99999)
    this.skills[newId] = {
      skillId,
      hp: 50,
      maxHp: 50,
      xp: 0,
      maxXp: 100,
      status: null,
    }
    if (this.lineup.length < 3) {
      this.lineup.push(newId)
    }
    utils.emitEvent("LineupChanged")
  }

  swapLineup(oldId, incomingId) {
    const oldIndex = this.lineup.indexOf(oldId)
    this.lineup[oldIndex] = incomingId
    utils.emitEvent("LineupChanged")
  }

  moveToFront(futureFrontId) {
    this.lineup = this.lineup.filter(id => id !== futureFrontId)
    this.lineup.unshift(futureFrontId)
    utils.emitEvent("LineupChanged")
  }
}
window.playerState = new PlayerState()
