const reverse = (s) =>
  s.split('').reverse().join('')

const average = (arr) => {
  const reducer = (sum, item) => sum + item

  return arr.reduce(reducer, 0) / arr.length
}

module.exports = { reverse, average }