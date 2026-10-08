export default (input, picker, select, close) => {
  let activeIndex = -1

  const options = () => Array.from(picker.querySelectorAll('[role="option"]'))
  const setActive = index => {
    const items = options()
    if (!items.length) return
    activeIndex = Math.max(0, Math.min(index, items.length - 1))
    items.forEach((item, itemIndex) => {
      item.setAttribute('aria-selected', String(itemIndex === activeIndex))
    })
    input.setAttribute('aria-activedescendant', items[activeIndex].id)
  }
  const clearActive = () => {
    activeIndex = -1
    options().forEach(item => item.setAttribute('aria-selected', 'false'))
    input.removeAttribute('aria-activedescendant')
  }

  const onKeydown = event => {
    const items = options()
    if (!items.length) return

    if (event.key === 'ArrowDown' && activeIndex < 0) {
      event.preventDefault()
      setActive(0)
    } else if (event.key === 'ArrowLeft' && activeIndex >= 0) {
      event.preventDefault()
      setActive(activeIndex - 1)
    } else if (event.key === 'ArrowRight' && activeIndex >= 0) {
      event.preventDefault()
      setActive(activeIndex + 1)
    } else if (event.key === 'ArrowUp' && activeIndex >= 0) {
      event.preventDefault()
      clearActive()
    } else if (event.key === 'Enter') {
      if (activeIndex >= 0) {
        event.preventDefault()
        select(activeIndex)
      }
    } else if (event.key === 'Escape') {
      close()
    }
  }
  input.addEventListener('keydown', onKeydown)

  const onClick = event => {
    const option = event.target.closest('[role="option"]')
    if (option && picker.contains(option)) select(Number(option.dataset.index))
  }
  picker.addEventListener('click', onClick)

  return {
    reset: () => {
      clearActive()
    },
    destroy: () => {
      input.removeEventListener('keydown', onKeydown)
      picker.removeEventListener('click', onClick)
    }
  }
}
