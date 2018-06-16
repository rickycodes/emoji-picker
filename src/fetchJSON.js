export default path => {
  return fetch(path).then(response => {
    const ct = response.headers.get('content-type')
    if (ct && ct.includes('application/json')) {
      return response.json()
    }
    throw new TypeError('this is not json!')
  }).then(json => {
    return json
  }).catch(console.log)
}
