var db = require('../../db')
var cache = require('../../lib/redis').client

var loadXml = require('./load-xml')

var filePath = process.argv[2]

db.start()

var xmlLoader = loadXml(filePath, cache)

xmlLoader.on('error', function (err) {
  console.log(err)
})

xmlLoader.on('finish', function () {
  db.stop()
  cache.quit()

  console.log('Load finished')
})
