var assert = require('chai').assert
var async = require('async')

var config = require('../../../config')
var cache = require('../../../lib/redis').client
var helpers = require('../../helpers')
var CreateParking = require('../../../resources/parking-lots/create')

describe('#Create parking', function () {
  describe('With errors', function () {
    before(function (done) {
      helpers.startDb()
      done()
    })

    after(function (done) {
      helpers.stopDb(done)
    })

    it('returns error when bad parameters are provided', function (done) {
      var params = {
        brand: 'randomBrand',
        licenseplate: 'randomLicenseplate'
      }

      CreateParking(params, cache, function (err) {
        assert.ok(err)
        assert.match(err.message, /is required/)
        done()
      })
    })

    it('returns error when parking lot is full', function (done) {
      var params = {
        brand: 'randomBrand',
        licenseplate: 'randomLicenseplate',
        parkinglotid: '1',
        parkingtime: '2016-01-25T16:36:31+00:00'
      }

      helpers.generateRandomParking(config.maxCars, '1', '2016-01-25T16:36:31+00:00', function () {
        CreateParking(params, cache, function (err) {
          assert.ok(err)
          assert.match(err.message, /is full/)
          done()
        })
      })
    })
  })

  describe('Without errors', function () {
    before(function (done) {
      helpers.startDb()
      done()
    })

    after(function (done) {
      helpers.stopDb(done)
    })

    it('creates a new parking', function (done) {
      var params = {
        brand: 'randomBrand',
        licenseplate: 'randomLicenseplate',
        parkinglotid: '1',
        parkingtime: '2016-01-25T16:36:31+00:00'
      }

      var tasks = [
        checkTotal,
        create,
        checkTotalUpdated
      ]

      async.series(tasks, done)

      function checkTotal (callback) {
        cache.get('parkinglot:1:total', function (err, total) {
          assert.notOk(err)
          assert.equal(total, null)
          callback(null)
        })
      }

      function create (callback) {
        CreateParking(params, cache, function (err) {
          assert.notOk(err)
          callback(null)
        })
      }

      function checkTotalUpdated (callback) {
        cache.get('parkinglot:1:total', function (err, total) {
          assert.notOk(err)
          assert.ok(total)
          assert.equal(total, 1)
          callback(null)
        })
      }
    })
  })
})
