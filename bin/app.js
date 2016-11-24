var app = require('../lib/server')()
var db = require('../db')

var PORT = process.env.PORT || 8000

db.start()

app.listen(PORT, function () {
  console.log('Parking server running on port', PORT)
})
