var assert = require('chai').assert
var sinon = require('sinon')
var supertest = require('supertest')

var helpers = require('../helpers')
var parkingLots = require('../../resources').parkingLots

describe('#Middleware', function () {
  describe('InitTime', function () {
    var request
    var app

    before(function (done) {
      sinon.stub(parkingLots, 'find', function (req, res, next) {
        res.send(req.params.initTime)
      })

      app = helpers.startServer()
      app.set('initTime', 'Summertime madness')
      request = supertest(app)

      done()
    })

    after(function (done) {
      parkingLots.find.restore()
      helpers.stopServer(done)
    })

    it('returns the app init time', function (done) {
      request.get('/parkinglots/1/cars/1')
        .end(function (err, res) {
          assert.notOk(err)
          assert.ok(res.text)
          assert.equal(res.statusCode, 200)
          assert.equal(res.text, 'Summertime madness')
          done()
        })
    })
  })
})
