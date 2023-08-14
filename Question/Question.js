class Question {
  constructor({ enemy, onComplete, arena }) {

    this.enemy = enemy;
    this.onComplete = onComplete;
    this.arena = arena;

    this.combatants = {
      // "player1": new Combatant({
      //   ...Skills.s001,
      //   team: "player",
      //   hp: 30,
      //   maxHp: 50,
      //   xp: 95,
      //   maxXp: 100,
      //   level: 1,
      //   status: { type: "saucy" },
      //   isPlayerControlled: true
      // }, this),
      // "enemy1": new Combatant({
      //   ...Skills.v001,
      //   team: "enemy",
      //   hp: 1,
      //   maxHp: 50,
      //   xp: 20,
      //   maxXp: 100,
      //   level: 1,
      // }, this),
    }

    this.activeCombatants = {
      player: null,
      enemy: null,
    }

    window.playerState.lineup.forEach(id => {
      this.addCombatant(id, "player", window.playerState.skills[id])
    })
    Object.keys(this.enemy.skills).forEach(key => {
      this.addCombatant("e_"+key, "enemy", this.enemy.skills[key])
    })
    this.items = []
    window.playerState.items.forEach(item => {
      this.items.push({
        ...item,
        team: "player"
      })
    })

    this.usedInstanceIds = {};

  }

  addCombatant(id, team, config) {
      this.combatants[id] = new Combatant({
        ...Skills[config.skillId],
        ...config,
        team,
        isPlayerControlled: team === "player"
      }, this)
      this.activeCombatants[team] = this.activeCombatants[team] || id
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Question");
    if (this.arena) {
      this.element.classList.add(this.arena);
    }

    this.element.innerHTML = (`
    <div class="Question_hero">
      <img src="/images/characters/icons/${window.playerState.hero.hero_skin || "hero_1"}.png" alt="Hero" />
    </div>
    <div class="Question_enemy">
      <img src="${this.enemy.character}" alt="${this.enemy.name}" />
    </div>
    `)
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    this.playerTeam = new Team("player", "Hero");
    this.enemyTeam = new Team("enemy", "Bully");

    Object.keys(this.combatants).forEach(key => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element)
      if (combatant.team === "player") {
        this.playerTeam.combatants.push(combatant);
      } else if (combatant.team === "enemy") {
        this.enemyTeam.combatants.push(combatant);
      }
    })

    this.playerTeam.init(this.element);
    this.enemyTeam.init(this.element);

    this.turnCycle = new TurnCycle({
      question: this,
      onNewEvent: event => {
        return new Promise(resolve => {
          const questionEvent = new QuestionEvent(event, this)
          questionEvent.init(resolve);
        })
      },
      onWinner: winner => {

        if (winner === "player") {
          const playerState = window.playerState;
          Object.keys(playerState.skills).forEach(id => {
            const playerStateSkill = playerState.skills[id];
            const combatant = this.combatants[id];
            if (combatant) {
              playerStateSkill.hp = combatant.hp;
              playerStateSkill.xp = combatant.xp;
              playerStateSkill.maxXp = combatant.maxXp;
            }
          })
          playerState.items = playerState.items.filter(item => {
            return !this.usedInstanceIds[item.instanceId]
          })
          utils.emitEvent("PlayerStateUpdated");
        }

        this.element.remove();
        this.onComplete(winner === "player");
      }
    })
    this.turnCycle.init();
  }

}
