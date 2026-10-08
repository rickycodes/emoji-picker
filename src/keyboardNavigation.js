export default (input, picker, select, close) => {
  let activeIndex = -1

  const options = () => Array.from(picker.querySelectorAll('[role="option"]'))
  const setActive = index => {
    const items = options()
    if (!items.length) return
    activeIndex = (index + items.length) % items.length
    items.forEach((item, itemIndex) => {
      item.setAttribute('aria-selected', String(itemIndex === activeIndex))
    })
    input.setAttribute('aria-activedescendant', items[activeIndex].id)
  }

  const onKeydown = event => {
    const items = options()
    if (!items.length) return

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setActive(activeIndex < 0 ? (direction > 0 ? 0 : items.length - 1) : activeIndex + direction)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      select(activeIndex < 0 ? 0 : activeIndex)
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
      activeIndex = -1
      input.removeAttribute('aria-activedescendant')
    },
    destroy: () => {
      input.removeEventListener('keydown', onKeydown)
      picker.removeEventListener('click', onClick)
    }
  }
}
