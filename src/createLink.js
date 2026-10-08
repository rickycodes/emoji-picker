export default (match, index, pickerId) => {
  const option = document.createElement('div')
  option.textContent = match.emoji
  option.id = `${pickerId}-option-${index}`
  option.dataset.index = index
  option.setAttribute('role', 'option')
  option.setAttribute('aria-label', match.name.replace(/_/g, ' '))
  option.setAttribute('aria-selected', 'false')
  option.setAttribute('class', 'emoji')
  return option
}
