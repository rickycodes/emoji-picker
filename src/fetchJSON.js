export default path => {
  return fetch(path).then(response => {
    if (!response.ok) throw new Error(`Could not load emoji data (${response.status})`)
    const ct = response.headers.get('content-type')
    if (ct && ct.includes('application/json')) {
      return response.json()
    }
    throw new TypeError('this is not json!')
  })
}
