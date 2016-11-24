var async = require('async')
var faker = require('faker')

var db = require('../db')
var redis = require('../lib/redis').client
var server = require('../lib/server')
var Parking = require('../db/parking')
var CreateParking = require('../resources/parking-lots/create')

var helpers = exports = module.exports

helpers.startServer = function () {
  var app = server()
  helpers.startDb()

  return app
}

helpers.stopServer = function (callback) {
  helpers.stopDb(callback)
}

helpers.startDb = function () {
  db.start()
}

helpers.stopDb = function (callback) {
  helpers.emptyDbs(function () {
    db.stop()
    callback(null)
  })
}

helpers.emptyDbs = function (callback) {
  emptyDb(function () {
    emptyRedis(callback)
  })
}

helpers.generateRandomParking = function (limit, parkinglotid, time, callback) {
  async.times(limit, create, callback)

  function create (i, next) {
    var p = {
      brand: faker.commerce.productName(),
      licenseplate: faker.finance.account(),
      parkinglotid: parkinglotid,
      parkingtime: time
    }

    CreateParking(p, redis, next)
  }
}

function emptyDb (callback) {
  Parking.remove({}, callback)
}

function emptyRedis (callback) {
  redis.keys('parkinglot*', function (err, keys) {
    if (err) {
      throw err
    }
    async.each(keys, redis.del.bind(redis), callback)
  })
}
