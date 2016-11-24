var Writable = require('stream').Writable
var inherits = require('util').inherits

var CreateService = require('../../resources/parking-lots/create')

var defaults = {
  objectMode: true,
  highWaterMark: 30
}

module.exports = Persist

function Persist (cache) {
  if (!(this instanceof Persist)) {
    return new Persist(cache)
  }

  this._cache = cache

  Writable.call(this, defaults)
}

inherits(Persist, Writable)

Persist.prototype._write = function (car, encoding, callback) {
  CreateService(car, this._cache, function (err, data) {
    if (err) {
      console.log('Error inserting car: ' + car.licenseplate)
      console.log(err)
    }

    callback(null)
  })
}
