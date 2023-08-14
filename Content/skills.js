window.SkillTypes = {
  normal: "normal",
  observant: "observant",
  quick: "quick on your feet",
  persuasive: "persuasive",
  confident: "confident",
  disoriented: "disoriented",
  sleepy: "sleepy",
  chill: "chill",
}

window.Skills = {
  "0obs": {
    name: window.translations["Skill: observant"],
    isSkillName: true,
    description: window.translations["You pay close attention to details."],
    type: SkillTypes.observant,
    src: "/images/icons/notepad.png",
    icon: "/images/icons/notepad.png",
    actions: [ "ask_name", "ask_death_gen", "damage1" ],
  },
  "0quick": {
    name: window.translations["Skill: quick"],
    isSkillName: true,
    description: window.translations["Quick thinking. Also, fast running."],
    type: SkillTypes.quick,
    src: "/images/icons/quick.png",
    icon: "/images/icons/quick.png",
    actions: [ "ask_death", "ask_ghost", "damage1" ],
  },
  "mrsT": {
    name: window.translations["Mrs T (widowed)"],
    description: window.translations["Has no idea what's going on."],
    type: SkillTypes.disoriented,
    src: "/images/characters/skills/s001.png",
    icon: "/images/icons/question-mark.png",
    actions: [ "disoriented1", "disoriented2", "sleepy" ],
  }
}
