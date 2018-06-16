import createLink from './createLink.js'
import clearElement from './clearElement.js'

export default (className, emoji) => {
  let matches
  const events = ['input', 'keyup']
  const input = document.querySelector(className)
  const picker = document.createElement('div')
  picker.setAttribute('class', 'picker')
  input.parentNode.appendChild(picker)

  const updateText = (last, emoji) => {
    input.value = input.value.replace(last, emoji)
    input.focus() & clearElement(picker)
  }

  const updatePicker = (str, matches) => {
    clearElement(picker) & matches.forEach(match => {
      picker.appendChild(createLink(str, match, updateText))
    })
  }

  const find = (str, emoji) => {
    const match = new RegExp(`^${str.substring(1, str.length)}`)
    matches = Object
      .keys(emoji)
      .filter(emoj => match.test(emoj))
      .map(key => ({ name: key, emoji: emoji[key] }))
    return matches.length && updatePicker(str, matches)
  }

  const onInput = (emoji, event) => {
    const { value } = event.target
    const lastWord = value.substring(value.lastIndexOf(' ') + 1, value.length)
    const match = /:[a-z0-9]/
    if (event.keyCode === 13 && matches.length && lastWord.match(match)) {
      return updateText(lastWord, matches[0].emoji)
    }
    return lastWord.match(match) ? find(lastWord, emoji) : clearElement(picker)
  }

  events.map((event) => input.addEventListener(event, onInput.bind(null, emoji)))
}
