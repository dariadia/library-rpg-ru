const shouldGiveClue = (level) => 
  window.playerState.clues === level 
    ? window.playerState.clues++ 
    : window.playerState.clues

const isRepeat = (level) => 
  window.playerState.clues < level
    ? window.translations["You got a clue!"]
    : window.translations["Haven't you heard that somewhere before?"]

window.Actions = {
  ask_name: {
    name: window.translations["Ask for her name"],
    description: window.translations["It's friendly... right?"],
    success: [
      { type: "textMessage", text: window.translations["So. What's your name?"] },
      { type: "stateChange", status: { type: "disoriented", expiresIn: 3 } },
      { type: "textMessage", text: window.translations["Nice to meet you."], character: CHARACTERS[MRS_T] },
      { type: "textMessage", text: window.translations["It's Mrs... Mrs... Mrs Ta- Mrs Te... Oh dear, oh dear..."], character: CHARACTERS[MRS_T], emotion: 'upset' },
      { type: "stateChange", damage: 5}
    ]
  },
  ask_death: {
    name: window.translations["Ask how she died"],
    description: window.translations["Because you're curious"],
    success: [
      { type: "textMessage", text: window.translations["How did you die?"]},
      { type: "textMessage", text: window.translations["I am not dead, dear..."], character: CHARACTERS[MRS_T] },
      { type: "textMessage", text: window.translations["What a sense of humour you have there!"], character: CHARACTERS[MRS_T] },
      { type: "textMessage", text: window.translations["I am not dead... Am I? That bookcase looked so heavy."], character: CHARACTERS[MRS_T], emotion: 'upset' },
      { type: "textMessage", text: window.translations["Imagine being buried by that many books all at once!"], character: CHARACTERS[MRS_T] },
      { type: "textMessage", 
        text: () => isRepeat(1), 
        cb: () => shouldGiveClue(0),
      },
      { type: "addStoryFlag", flag: "CLUES:BOOKCASE"},
      { type: "stateChange", status: { type: "shocked", expiresIn: 2 } },
      { type: "stateChange", damage: 10 }
    ]
  },
  ask_death_gen: {
    name: window.translations["Ask about death"],
    description: window.translations["In general. Because you're curious"],
    success: [
      { type: "textMessage", text: window.translations["How does one die in a library? I mean, does your soul stay here forever?"]},
      { type: "textMessage", text: window.translations["Oh dear, what an interesting question."], character: CHARACTERS[MRS_T] },
      { type: "textMessage", text: window.translations["I have no idea, I am afraid."], character: CHARACTERS[MRS_T], emotion: 'upset' },
      { type: "textMessage", text: window.translations["Some days I think I work so much in this library, I might be dead myself!"], character: CHARACTERS[MRS_T] },
      { type: "textMessage", text: window.translations["Haunting a library, can you imagine?"], character: CHARACTERS[MRS_T], emotion: "upset" },
      { type: "textMessage", 
        text: () => isRepeat(1), 
        cb: () => shouldGiveClue(0),
      },
      { type: "addStoryFlag", flag: "CLUES:BOOKCASE"},
      { type: "stateChange", damage: 10 }
    ]
  },
  ask_ghost: {
    name: window.translations["Ask if she's a ghost"],
    description: window.translations["What can go wrong, right?"],
    success: [
      { type: "textMessage", text: window.translations["So. How come you're a ghost?"]},
      { type: "textMessage", text: window.translations["What could you possibly mean, dear?.."], character: CHARACTERS[MRS_T], emotion: 'upset' },
      { type: "stateChange", status: { type: "shocked", expiresIn: 2 } },
      { type: "stateChange", damage: 10 }
    ]
  },
  damage1: {
    name: window.translations["Walk through her"],
    description: window.translations["Because you can"],
    success: [
      { type: "animation", animation: "move", direction: "forward"  },
      { type: "textMessage", text: window.translations["Oh shit, this feels weird"] },
      { type: "textMessage", text: window.translations["*gasps*"], character: CHARACTERS[MRS_T], emotion: 'upset' },
      { type: "animation", animation: "move", direction: "backward"  },
      { type: "stateChange", status: { type: "shocked", expiresIn: 2 } },
      { type: "stateChange", damage: 10 }
    ]
  },
  confident: {
    name: window.translations["Feeling confident!"],
    description: window.translations["Emergency confidence boost"],
    targetType: "friendly",
    success: [
      { type: "textMessage", text: window.translations["{CASTER} uses {ACTION}!"]},
      { type: "animation", animation: "glob", color: "#dafd2a" },
      { type: "stateChange", status: { type: "confident", expiresIn: 3 } }
    ]
  },
  sleepy: {
    name: window.translations["sleepy"],
    description: window.translations["Do they all talk without a point this much?.."],
    success: [
      { type: "textMessage", text: window.translations["Oh dear, oh dear, the weather today is just lovely, isn't it?"], character: CHARACTERS[MRS_T]},
      { type: "textMessage", character: CHARACTERS[MRS_T],text: window.translations["I remember when my husband was still around, we would..."] },
      { type: "textMessage", character: CHARACTERS[MRS_T],text: window.translations["... and then, oh, do you remind me of our neighbour, dearest Frau Schmidt! So lively, so animated..."] },
      { type: "textMessage", character: CHARACTERS[MRS_T],emotion: 'upset', text: window.translations["... my poor Karl left us so early. My job here keeps me going, of course. Oh dear, all the books to look after..."] },
      { type: "stateChange", status: { type: "sleepy", expiresIn: 3 } },
      { type: "textMessage", text: window.translations["Ugh... she has a point, right?.."]},
    ]
  },
  disoriented1: {
    name: window.translations["Disoriented"],
    description: window.translations["No longer has any idea what's going on!"],
    success: [
      { type: "textMessage", character: CHARACTERS[MRS_T], text: window.translations["Hello, dear. Sorry, I did not see you there!"]},
      { type: "stateChange", damage: 3 }
    ]
  },
  disoriented2: {
    name: window.translations["Disoriented"],
    description: window.translations["No longer has any idea what's going on!"],
    success: [
      { type: "textMessage",  character: CHARACTERS[MRS_T], text: window.translations["What book did you come for? Let me check..."]},
      { type: "stateChange", status: { type: "disoriented", expiresIn: 2 } },
      { type: "textMessage", character: CHARACTERS[MRS_T],text: window.translations["Oh dear, I was so sure this is the West wing..."]},
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
    name: window.translations["stale granola bar"],
    description: window.translations["Tastes better when hungry"],
    targetType: "friendly",
    success: [
      { type:"textMessage", text: window.translations[`{HERO} finds a {ACTION} in their bag!`] },
      { type:"stateChange", recover: 10, },
      { type:"textMessage", text: window.translations[`{HERO} recovers HP!`], },
    ]
  },
}
