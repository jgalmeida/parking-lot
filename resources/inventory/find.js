var Joi = require('joi')
var Boom = require('boom')

// var reduceData = require('./reduce-data-simple')
var reduceData = require('./reduce-data-mongo')

var Schema = Joi.object().keys({
  t: Joi.number().required(),
  initTime: Joi.date().required()
})

module.exports = function (params, callback) {
  var validation = Joi.validate(params, Schema)

  if (validation.error) {
    return callback(Boom.badRequest(validation.error))
  }

  reduceData(params, function (err, data) {
    if (err) {
      return callback(err)
    }

    callback(null, data)
  })
}
