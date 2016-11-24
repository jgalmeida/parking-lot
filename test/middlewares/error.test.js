var assert = require('chai').assert
var sinon = require('sinon')
var supertest = require('supertest')

var helpers = require('../helpers')
var parkingLots = require('../../resources').parkingLots

describe('#Middleware', function () {
  describe('Error', function () {
    var request
    var app

    before(function (done) {
      sinon.stub(parkingLots, 'find', function (req, res, next) {
        next(new Error('Fake error'))
      })

      app = helpers.startServer()
      request = supertest(app)

      done()
    })

    after(function (done) {
      parkingLots.find.restore()
      helpers.stopServer(done)
    })

    it('returns 500 when server error', function (done) {
      request.get('/parkinglots/1/cars/1')
        .end(function (err, res) {
          assert.notOk(err)
          assert.ok(res.body)
          assert.equal(res.statusCode, 500)
          assert.equal(res.body.message, 'Fake error')
          done()
        })
    })
  })
})
