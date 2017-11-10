export default (str, match, method) => {
  const link = document.createElement('a')
  link.innerHTML = match.emoji
  link.setAttribute('title', match.name)
  link.setAttribute('class', 'emoji')
  link.addEventListener('click', () => method(str, match.emoji))
  return link
}
