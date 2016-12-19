(() => {
  let matches
  const input = document.querySelector('.input')
  const picker = document.querySelector('.picker')

  const updateText = (last, emoji) => {
    input.value = input.value.replace(last, emoji)
    input.focus()
    picker.innerHTML = ''
  }

  const updatePicker = (str, matches) => {
    picker.innerHTML = ''
    matches.forEach((match) => {
      const a = document.createElement('a')
      a.innerHTML = match.emoji
      a.setAttribute('title', match.name)
      a.setAttribute('class', 'emoji')
      a.addEventListener('click', () => updateText(str, match.emoji))
      picker.appendChild(a)
    })
  }

  const find = (str) => {
    const match = new RegExp(`^${str.substring(1, str.length)}`)
    matches = Object.keys(window.emoji).filter((emoj) => match.test(emoj)).map((key) => ({ name: key, emoji: window.emoji[key] }))
    matches.length && updatePicker(str, matches)
  }

  const onInput = (event) => {
    const val = input.value
    const lastWord = val.substring(val.lastIndexOf(' ') + 1, val.length)
    event.keyCode === 13 && matches.length && updateText(lastWord, matches[0].emoji)
    const match = /:[a-z]/
    lastWord.match(match) ? find(lastWord) : picker.innerHTML = ''
  }

  input.addEventListener('input', onInput)
})()
