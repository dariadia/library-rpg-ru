class ChooseCharacter {
  constructor({ container }){
    this.parent = container
    this.chooseCharacterEl = document.createElement("form")
  }
  onSubmit(resolve) {
    this.chooseCharacterEl.onsubmit = (event) => {
      event.preventDefault()
      window.playerState.hero = Object.fromEntries(new FormData(event.target))
      this.chooseCharacterEl.remove()
      resolve()
    }
  }
  async init() {
    this.chooseCharacterEl.classList.add("ChooseCharacter_wrapper")
    this.chooseCharacterEl.innerHTML = `
      <section class="ChooseCharacter_skin"> 
        <h1>Choose your character:</h1>
        <label for="hero_1">
          <input type="radio" id="hero_1" value="hero_1" name="hero_skin" checked />
          <span class="hero-icon one"></span><span class="hero-icon two"></span>
        </label>
       <label for="hero_2">
         <input type="radio" id="hero_2" value="hero_2" name="hero_skin" />
          <span class="hero-icon one"></span><span class="hero-icon two"></span>
        </label>
        <label for="hero_3">
          <input type="radio" id="hero_3" value="hero_3" name="hero_skin">
          <span class="hero-icon one"></span><span class="hero-icon two"></span>
        </label>
      </section> 
      <section class="ChooseCharacter_pronouns">    
        <h2>Choose your pronouns:</h2>
        <label for="they"><input type="radio" id="they" name="pronouns" value="they" checked>They/their</label>
        <label for="she"><input type="radio" id="she" name="pronouns" value="she">She/her</label> 
        <label for="he"><input type="radio" id="he" name="pronouns" value="he">He/his</label>
      </section>
      <section class="ChooseCharacter_name"> 
        <label for="hero_name">Enter your name:</label>
        <input id="hero_name" name="your_name" value="YN">
      </section> 
      <button id="ChooseCharacter_ok">OK</button>`
      this.parent.appendChild(this.chooseCharacterEl)
      document.getElementById("ChooseCharacter_ok").focus()
  }
}
