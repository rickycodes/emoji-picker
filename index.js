(() => {
  let emoji
  let matches

  const getJSON = (url, successHandler, errorHandler) => {
    const xhr = new window.XMLHttpRequest()
    xhr.open('get', url, true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const status = xhr.status
        if (status === 200) {
          successHandler && successHandler(JSON.parse(xhr.responseText))
        } else {
          errorHandler && errorHandler(status)
        }
      }
    }
    xhr.send()
  }

  const input = document.querySelector('.input')
  const picker = document.querySelector('.picker')
  const clearPicker = () => { picker.innerHTML = '' }
  const updatePicker = (str, matches) => {
    clearPicker() & matches.forEach((match) => {
      picker.appendChild(createLink(str, match))
    })
  }

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
    matches = Object.keys(emoji).filter((emoj) => {
      return match.test(emoj)
    }).map((key) => {
      return { name: key, emoji: emoji[key] }
    })
    return matches.length && updatePicker(str, matches)
  }

  const onInput = (event) => {
    const val = input.value
    const lastWord = val.substring(val.lastIndexOf(' ') + 1, val.length)
    const match = /:[a-z0-9]/
    if (event.keyCode === 13 && matches.length && lastWord.match(match)) {
      return updateText(lastWord, matches[0].emoji)
    }
    return lastWord.match(match) ? find(lastWord) : clearPicker()
  }

  getJSON('emoji.json', (data) => {
    emoji = data
    const events = ['input', 'keyup']
    events.map((event) => input.addEventListener(event, onInput))
  })
})()
