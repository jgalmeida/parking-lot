var Readable = require('stream').Readable
var inherits = require('util').inherits
var fs = require('fs')
var XmlStream = require('xml-stream')

var defaults = {
  objectMode: true,
  highWaterMark: 30
}

module.exports = XmlProcessor

function XmlProcessor (filePath) {
  if (!(this instanceof XmlProcessor)) {
    return new XmlProcessor(filePath)
  }

  var stream = fs.createReadStream(filePath)
  var that = this

  this._xmlStream = new XmlStream(stream)

  this._xmlStream.on('endElement: car', function (car) {
    if (!that.push(car)) {
      that._xmlStream.pause()
    }
  })

  this._xmlStream.on('end', function () {
    that.push(null)
  })

  Readable.call(this, defaults)
}

inherits(XmlProcessor, Readable)

XmlProcessor.prototype._read = function () {
  if (this._xmlStream._suspended) {
    this._xmlStream.resume()
  }
}
