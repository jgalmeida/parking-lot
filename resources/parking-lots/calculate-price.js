var moment = require('moment')

var config = require('../../config')

var PER_HOUR = config.amountPerHour
var DISCOUNT = config.discount
var DISCOUNT_HOURS = config.discountHours

module.exports = function (car, date) {
  var parkingTime = moment(car.parkingtime)
  var hoursDiff = Number(moment(date).diff(parkingTime, 'hours'))

  var ret = {
    amountDue: 0,
    discount: 0
  }

  if (hoursDiff > 0) {
    var totalAmount = hoursDiff * PER_HOUR
    var discount = hoursDiff > DISCOUNT_HOURS ? (hoursDiff - DISCOUNT_HOURS) * DISCOUNT : 0

    ret.amountDue = Number((totalAmount - discount).toFixed(2))
    ret.discount = Number(discount.toFixed(2))
  }

  return ret
}
