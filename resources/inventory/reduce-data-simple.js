var moment = require('moment')
var Boom = require('boom')

var Parking = require('../../db/parking')
var calculatePrice = require('../parking-lots/calculate-price')

module.exports = function (params, callback) {
  var futureDate = moment(params.initTime).add(params.t, 'hours')

  // Get cars that parked after app started, because when it starts there are no cars
  var query = {
    parkingtime: {
      $gte: params.initTime
    }
  }

  var r = {
    totalAmountOfCars: 0,
    value: 0,
    discountInCents: 0
  }

  Parking.find(query, function (err, data) {
    if (err) {
      return callback(Boom.badImplementation(err))
    }

    data.reduce(function (prev, curr) {
      var pricingInfo = calculatePrice(curr, futureDate)

      prev.value += pricingInfo.amountDue
      prev.discountInCents += (pricingInfo.discount * 100)

      return prev
    }, r)

    r.value = Number(r.value.toFixed(2))
    r.discountInCents = Number(r.discountInCents.toFixed(2))
    r.totalAmountOfCars = data.length

    callback(null, r)
  })
}
