var mongoose = require('mongoose')

var config = require('../config')

module.exports = {
  start: start,
  stop: stop
}

function start () {
  mongoose.connect(config.mongodb)
}

function stop () {
  mongoose.disconnect()
}
