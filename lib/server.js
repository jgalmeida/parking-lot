var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')

module.exports = function () {
  var app = express()
  app.disable('x-powered-by')
  app.set('initTime', new Date('2016-04-26T10:00:00+00:00'))

  // Logger
  app.use(morgan('[:date[clf]] :method :url :status :response-time ms'))

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  // Resources
  require('./routes')(app)

  // Error
  app.use(require('../middlewares/error'))

  return app
}
