var express = require('express')
var path = require('path')

var resources = require('../resources')

// Middlewares
var initTime = require('../middlewares/initTime')

module.exports = function (app) {
  app.use('/dashboard', express.static(path.join(__dirname, '/../frontend')))

  app.get('/parkinglots/:id/cars/:t', initTime, resources.parkingLots.find)
  app.post('/parkinglots/:id/cars', initTime, resources.parkingLots.create)
  app.get('/inventory/:t', initTime, resources.inventory.find)
  app.get('/stats', initTime, resources.stats)
}
