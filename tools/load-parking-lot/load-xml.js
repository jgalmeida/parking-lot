var assert = require('assert')
var fs = require('fs')
var XmlStream = require('xml-stream')
var EE = require('events').EventEmitter

var CreateService = require('../../resources/parking-lots/create')

module.exports = function (filePath, cache, callback) {
  assert(filePath, 'File to load is required')

  var ee = new EE()
  var batchSize = 30
  var counter = 0
  var stream = fs.createReadStream(filePath)
  var xml = new XmlStream(stream)

  xml.on('error', function (err) {
    ee.emit('error', err)
  })

  xml.on('endElement: car', function (car) {
    counter++

    if (counter >= batchSize) {
      xml.pause()
    }

    car = car.$
    CreateService(car, cache, function (err, data) {
      if (err) {
        ee.emit('error', err)
      }

      if (counter >= batchSize) {
        xml.resume()
      }

      counter--

      if (!counter) {
        ee.emit('finish')
      }
    })
  })

  xml.on('end', function () {
    console.log('Parsing ended')
  })

  return ee
}
