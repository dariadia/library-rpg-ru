(function () {
  const playerHasNoKeyboard = navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPad/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i)
  if (playerHasNoKeyboard) {
    const mobileKeyboard = new MobileKeyboard({})
    mobileKeyboard.init()
    mobileKeyboard.hide()
    window.playerState.mobileKeyboard = mobileKeyboard
  }

  const overworld = new Overworld({
    element: document.querySelector(".game-container")
  })
  overworld.init()

})()
