module.exports = function (car, date) {
  var PER_HOUR = 1.20
  var DISCOUNT = 0.10
  var DISCOUNT_HOURS = 3

  var hoursDiff = (new Date(date) - new Date(car.parkingtime)) / (1000 * 60 * 60)
  hoursDiff = Math.floor(hoursDiff)

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
