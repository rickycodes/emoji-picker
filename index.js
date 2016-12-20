(() => {
  let matches
  const input = document.querySelector('.input')
  const picker = document.querySelector('.picker')
  const clearPicker = () => picker.innerHTML = ''
  const updatePicker = (str, matches) => clearPicker() & matches.forEach((match) => picker.appendChild(createLink(str, match)))

  const createLink = (str, match) => {
    const link = document.createElement('a')
    link.innerHTML = match.emoji
    link.setAttribute('title', match.name)
    link.setAttribute('class', 'emoji')
    link.addEventListener('click', () => updateText(str, match.emoji))
    return link
  }

  const updateText = (last, emoji) => {
    input.value = input.value.replace(last, emoji)
    input.focus() & clearPicker()
  }

  const find = (str) => {
    const match = new RegExp(`^${str.substring(1, str.length)}`)
    matches = Object.keys(window.emoji).filter((emoj) => match.test(emoj)).map((key) => ({ name: key, emoji: window.emoji[key] }))
    matches.length && updatePicker(str, matches)
  }

  const onKeyUp = (event) => {
    const val = input.value
    const lastWord = val.substring(val.lastIndexOf(' ') + 1, val.length)
    event.keyCode === 13 && matches.length && updateText(lastWord, matches[0].emoji)
    const match = /:[a-z]/
    lastWord.match(match) ? find(lastWord) : clearPicker()
  }

  input.addEventListener('keyup', onKeyUp)
})()
