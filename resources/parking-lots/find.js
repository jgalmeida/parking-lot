var pump = require('pump')
var moment = require('moment')
var JSONStream = require('JSONStream')
var es = require('event-stream')
var Joi = require('joi')
var Boom = require('boom')

var Parking = require('../../db/parking')
var calculatePrice = require('./calculate-price')

var Schema = Joi.object().keys({
  id: Joi.number().required(),
  t: Joi.number().required(),
  initTime: Joi.date().required()
})

module.exports = function (params, res, callback) {
  var validation = Joi.validate(params, Schema)

  if (validation.error) {
    return callback(Boom.badRequest(validation.error))
  }

  // Get cars that parked after app started, because when it starts there are no cars
  var query = {
    parkinglotid: params.id,
    parkingtime: {
      $gte: params.initTime
    }
  }

  var DataStream = Parking.find(query).lean().cursor()

  res.set('Content-Type', 'application/json')

  var MapData = es.map(function (data, callback) {
    // Date to calculate amount due is app start time plus provided parameter
    var futureDate = moment(params.initTime).add(params.t, 'hours')
    var pricingInfo = calculatePrice(data, futureDate)

    var newData = {
      brand: data.brand,
      licensePlate: data.licenseplate,
      parkingTime: data.parkingtime,
      value: pricingInfo.amountDue,
      discountInCents: Number((pricingInfo.discount * 100).toFixed(2))
    }

    callback(null, newData)
  })

  pump(DataStream, MapData, JSONStream.stringify(), res, function (err) {
    if (err) {
      return callback(err)
    }
  })
}
