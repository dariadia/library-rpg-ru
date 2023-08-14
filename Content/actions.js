const shouldGiveClue = (level) => 
  window.playerState.clues === level 
    ? window.playerState.clues++ 
    : window.playerState.clues

const isRepeat = (level) => 
  window.playerState.clues === level
  ? "You got a clue!" 
  : "Haven't you heard that somewhere before?"

window.Actions = {
  ask_name: {
    name: "Ask for her name",
    description: "It's friendly... right?",
    success: [
      { type: "textMessage", text: "So. What's your name?" },
      { type: "stateChange", status: { type: "disoriented", expiresIn: 3 } },
      { type: "textMessage", text: "Nice to meet you.", character: CHARACTERS[MRS_T] },
      { type: "textMessage", text: "It's Mrs... Mrs... Mrs Ta- Mrs Te... Oh dear, oh dear...", character: CHARACTERS[MRS_T], emotion: 'upset' },
      { type: "stateChange", damage: 5}
    ]
  },
  ask_death: {
    name: "Ask how she died",
    description: "Because you're curious",
    success: [
      { type: "textMessage", text: "How did you die?"},
      { type: "textMessage", text: "I am not dead, dear...", character: CHARACTERS[MRS_T] },
      { type: "textMessage", text: "What a sense of humour you have there!", character: CHARACTERS[MRS_T] },
      { type: "textMessage", text: "I am not dead... Am I? That bookcase looked so heavy.", character: CHARACTERS[MRS_T], emotion: 'upset' },
      { type: "textMessage", text: "Imagine being buried by that many books all at once!", character: CHARACTERS[MRS_T] },
      { type: "textMessage", 
        text: isRepeat(0), 
        cb: () => shouldGiveClue(0),
      },
      { type: "addStoryFlag", flag: "CLUES:BOOKCASE"},
      { type: "stateChange", status: { type: "shocked", expiresIn: 2 } },
      { type: "stateChange", damage: 10 }
    ]
  },
  ask_death_gen: {
    name: "Ask about death",
    description: "In general. Because you're curious",
    success: [
      { type: "textMessage", text: "How does one die in a library? I mean, does your soul stay here forever?"},
      { type: "textMessage", text: "Oh dear, what an interesting question.", character: CHARACTERS[MRS_T] },
      { type: "textMessage", text: "I have no idea, I am afraid.", character: CHARACTERS[MRS_T], emotion: 'upset' },
      { type: "textMessage", text: "Some days I think I work so much in this library, I might be dead myself!", character: CHARACTERS[MRS_T] },
      { type: "textMessage", text: "Haunting a library, can you imagine? ", character: CHARACTERS[MRS_T], emotion: "upset" },
      { type: "textMessage", 
        text: isRepeat(0), 
        cb: () => shouldGiveClue(0), 
      },
      { type: "addStoryFlag", flag: "CLUES:BOOKCASE"},
      { type: "stateChange", damage: 10 }
    ]
  },
  ask_ghost: {
    name: "Ask if she's a ghost",
    description: "What can go wrong, right?",
    success: [
      { type: "textMessage", text: "So. How come you're a ghost?"},
      { type: "textMessage", text: "What could you possibly mean, dear?..", character: CHARACTERS[MRS_T], emotion: 'upset' },
      { type: "stateChange", status: { type: "shocked", expiresIn: 2 } },
      { type: "stateChange", damage: 10 }
    ]
  },
  damage1: {
    name: "Walk through her",
    description: "Because you can",
    success: [
      { type: "animation", animation: "move", direction: "forward"  },
      { type: "textMessage", text: "Oh shit, this feels weird" },
      { type: "textMessage", text: "*gasps*", character: CHARACTERS[MRS_T], emotion: 'upset' },
      { type: "animation", animation: "move", direction: "backward"  },
      { type: "stateChange", status: { type: "shocked", expiresIn: 2 } },
      { type: "stateChange", damage: 10 }
    ]
  },
  confident: {
    name: "Feeling confident!",
    description: "Emergency confidence boost",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "glob", color: "#dafd2a" },
      { type: "stateChange", status: { type: "confident", expiresIn: 3 } }
    ]
  },
  sleepy: {
    name: "sleepy",
    description: "Do they all talk without a point this much?..",
    success: [
      { type: "textMessage", text: "Oh dear, oh dear, the weather today is just lovely, isn't it?", character: CHARACTERS[MRS_T]},
      { type: "textMessage", character: CHARACTERS[MRS_T],text: "I remember when my husband was still around, we would..." },
      { type: "textMessage", character: CHARACTERS[MRS_T],text: "... and then, oh, do you remind me of our neighbour, dearest Frau Schmidt! So lively, so animated..." },
      { type: "textMessage", character: CHARACTERS[MRS_T],emotion: 'upset', text: "... my poor Karl left us so early. My job here keeps me going, of course. Oh dear, all the books to look after..." },
      { type: "stateChange", status: { type: "sleepy", expiresIn: 3 } },
      { type: "textMessage", text: "Ugh... she has a point, right?.."},
    ]
  },
  disoriented1: {
    name: "Disoriented",
    description: "No longer has any idea what's going on!",
    success: [
      { type: "textMessage", character: CHARACTERS[MRS_T], text: "Hello, dear. Sorry, I did not see you there!"},
      { type: "stateChange", damage: 3 }
    ]
  },
  disoriented2: {
    name: "Disoriented",
    description: "No longer has any idea what's going on!",
    success: [
      { type: "textMessage",  character: CHARACTERS[MRS_T], text: "What book did you come for? Let me check..."},
      { type: "stateChange", status: { type: "disoriented", expiresIn: 2 } },
      { type: "textMessage", character: CHARACTERS[MRS_T],text: "Oh dear, I was so sure this is the West wing..."},
    ]
  },
  //Items
  item_recoverStatus: {
    name: "Heating Lamp",
    description: "Feeling fresh and warm",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses a {ACTION}!"},
      { type: "stateChange", status: null },
      { type: "textMessage", text: "Feeling fresh!", },
    ]
  },
  item_recoverHp: {
    name: "stale granola bar",
    description: "Tastes better when hungry",
    targetType: "friendly",
    success: [
      { type:"textMessage", text: `{HERO} finds a {ACTION} in their bag!` },
      { type:"stateChange", recover: 10, },
      { type:"textMessage", text: `{HERO} recovers HP!`, },
    ]
  },
}
