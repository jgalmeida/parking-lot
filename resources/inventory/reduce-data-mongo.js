var moment = require('moment')
var Boom = require('boom')

var Parking = require('../../db/parking')
var calculatePrice = require('./calculate-price-no-deps')

module.exports = function (params, callback) {
  var futureDate = moment(params.initTime).add(params.t, 'hours').toString()

  // Get cars that parked after app started, because when it starts there are no cars
  var query = {
    parkingtime: {
      $gte: params.initTime
    }
  }

  var o = {
    verbose: true,
    map: function () {
      var obj = calculatePrice(this, futureDate)

      var r = {
        value: obj.amountDue,
        discountInCents: obj.discount,
        totalAmountOfCars: 1
      }
      emit(1, r)
    },
    reduce: function (k, data) {
      var r = {
        totalAmountOfCars: 0,
        value: 0,
        discountInCents: 0
      }

      for (var i = 0; i < data.length; i++) {
        r.value += data[i].value
        r.discountInCents += data[i].discountInCents
        r.totalAmountOfCars += data[i].totalAmountOfCars
      }

      return r
    },
    finalize: function (k, v) {
      v.value = Number(v.value.toFixed(2))
      v.discountInCents = Number((v.discountInCents * 100).toFixed(2))

      return v
    },
    scope: {
      futureDate: futureDate,
      calculatePrice: calculatePrice
    },
    query: query
  }

  Parking.mapReduce(o, function after (err, results) {
    if (err) {
      return callback(Boom.badImplementation(err))
    }

    var defaultValue = {
      totalAmountOfCars: 0,
      value: 0,
      discountInCents: 0
    }

    var r = results[0] || {value: defaultValue}

    callback(null, r.value)
  })
}
