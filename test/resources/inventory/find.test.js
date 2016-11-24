var assert = require('chai').assert
var supertest = require('supertest')
var async = require('async')

var helpers = require('../../helpers')

describe('#Find inventory info', function () {
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
      request.get('/inventory/s')
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
        { parkinglotid: '2', parkingtime: '2016-01-25T20:36:31+00:00' }
      ]

      async.each(cars, insert, done)

      function insert (car, next) {
        helpers.generateRandomParking(1, car.parkinglotid, car.parkingtime, next)
      }
    })

    after(function (done) {
      helpers.stopServer(done)
    })

    it('returns inventory information for all parks', function (done) {
      request.get('/inventory/7')
        .end(function (err, res) {
          assert.notOk(err)
          assert.ok(res.body)
          assert.equal(res.statusCode, 200)

          assert.equal(res.body.totalAmountOfCars, 2)
          assert.equal(res.body.value, 8.2)
          assert.equal(res.body.discountInCents, 20)

          done()
        })
    })
  })
})
