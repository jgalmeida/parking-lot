var assert = require('assert')
var pump = require('pump')

var db = require('../../db')
var cache = require('../../lib/redis').client

var filePath = process.argv[2]

assert(filePath, 'File to load is required')

db.start()

var XmlProcessor = require('./xml-processor')
var ProcessData = require('./process-data')
var Persist = require('./persist.js')

pump(XmlProcessor(filePath), ProcessData(), Persist(cache), function (err) {
  if (err) {
    console.log(err)
  }

  console.log('Finished')

  db.stop()
  cache.quit()
})
