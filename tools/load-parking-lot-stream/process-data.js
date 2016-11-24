var Transform = require('stream').Transform

module.exports = function (data, callback) {
  var process = new Transform({
    objectMode: true,
    highWaterMark: 30
  })

  process._transform = function (chunk, encoding, callback) {
    callback(null, chunk.$)
  }

  return process
}
