var assert = require('chai').assert
var tmp = require('tmp')
var fs = require('fs')

var loadXml = require('../../../tools/load-parking-lot/load-xml')
var Parking = require('../../../db/parking')
var cache = require('../../../lib/redis').client
var helpers = require('../../helpers')

describe('Xml Loader', function () {
  before(function (done) {
    helpers.startDb()
    done()
  })

  after(function (done) {
    helpers.stopDb(done)
  })

  it('throws an error when the filePath is not provided', function () {
    assert.throws(loadXml, Error, 'File to load is required')
  })

  it('throws an error when invalid xml file is provided', function (done) {
    var xml = [
      '<cars',
      "<car brand='volkswagen' licenseplate='12-abc-34'/>",
      '</cars>'
    ].join('')

    var tmpFile = tmp.fileSync()
    fs.writeFileSync(tmpFile.name, xml)

    var xmlLoader = loadXml(tmpFile.name, cache)

    xmlLoader.on('error', function (err) {
      console.log(err.message)
      assert.match(err.message, /not well-formed/)
      done()
    })
  })

  it('creates records according to provided xml', function (done) {
    var xml = [
      '<cars>',
      "<car brand='volkswagen' licenseplate='12-abc-34' parkinglotid='1'" +
      " parkingtime='2016-01-25T16:36:31+00:00' />",
      "<car brand='bmw' licenseplate='21-abc-34' parkinglotid='1'" +
      " parkingtime='2016-01-25T16:36:31+00:00' />",
      '</cars>'
    ].join('')

    var tmpFile = tmp.fileSync()
    fs.writeFileSync(tmpFile.name, xml)

    var xmlLoader = loadXml(tmpFile.name, cache)

    xmlLoader.on('finish', function () {
      Parking.count({}, function (err, count) {
        assert.notOk(err)
        assert.equal(2, count)
        done()
      })
    })
  })
})
