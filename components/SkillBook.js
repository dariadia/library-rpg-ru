class SkillBook extends GameObject {
  constructor(config) {
    super(config);
    this.sprite = new Sprite({
      gameObject: this,
      src: "/images/characters/skill-book.png",
      animations: {
        "used-down"   : [ [0,0] ],
        "unused-down" : [ [1,0] ],
      },
      currentAnimation: "used-down"
    });
    this.storyFlag = config.storyFlag;
    this.skills = config.skills;

    this.talking = [
      {
        required: [this.storyFlag],
        events: [
          { type: "textMessage", text: "You have already used this." },
        ]
      },
      {
        events: [
          { type: "textMessage", text: "Approaching the legendary stone..." },
          { type: "craftingMenu", skills: this.skills },
          { type: "addStoryFlag", flag: this.storyFlag },
        ]
      }
    ]

  }

  update() {
   this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag]
    ? "used-down"
    : "unused-down";
  }

}
