var assert = require('chai').assert
var supertest = require('supertest')
var async = require('async')

var helpers = require('../../helpers')

describe('#Find  parking lot info', function () {
  describe('With errors', function () {
    var request
    var app

    before(function (done) {
      app = helpers.startServer()
      request = supertest(app)
      done()
    })

    after(function (done) {
      helpers.stopServer(done)
    })

    it('returns error when invalid params are provided', function (done) {
      request.get('/parkinglots/s/cars/s')
        .end(function (err, res) {
          assert.notOk(err)
          assert.equal(res.statusCode, 400)
          assert.match(res.body.message, /ValidationError/)
          done()
        })
    })
  })

  describe('Without errors', function () {
    var request
    var app

    before(function (done) {
      app = helpers.startServer()
      app.set('initTime', '2016-01-25T16:00:00+00:00')
      request = supertest(app)

      var cars = [
        { parkinglotid: '1', parkingtime: '2016-01-25T17:36:31+00:00' },
        { parkinglotid: '1', parkingtime: '2016-01-25T20:36:31+00:00' }
      ]

      async.each(cars, insert, done)

      function insert (car, next) {
        helpers.generateRandomParking(1, car.parkinglotid, car.parkingtime, next)
      }
    })

    after(function (done) {
      helpers.stopServer(done)
    })

    it('returns existing cars for the parkinglot with correct amounts', function (done) {
      request.get('/parkinglots/1/cars/7')
        .end(function (err, res) {
          var cars = res.body

          assert.notOk(err)
          assert.ok(res.body)
          assert.equal(res.statusCode, 200)
          assert.equal(res.headers['content-type'], 'application/json')
          assert.equal(res.headers['transfer-encoding'], 'chunked')
          assert.equal(cars.length, 2)

          assert.equal(cars[0].value, 5.8)
          assert.equal(cars[0].discountInCents, 20)
          assert.equal(cars[1].value, 2.4)
          assert.equal(cars[1].discountInCents, 0)
          done()
        })
    })
  })
})
