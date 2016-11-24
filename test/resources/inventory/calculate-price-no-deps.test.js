var assert = require('chai').assert

var calculatePrice = require('../../../resources/inventory/calculate-price-no-deps')

describe('#Calculate price', function () {
  var car = {
    parkingtime: '2016-01-25T16:00:00+00:00'
  }

  it('calculates the amount due for 2hrs of parking', function () {
    var pricing = calculatePrice(car, '2016-01-25T18:00:00+00:00')

    assert.equal(pricing.amountDue, 2.4)
    assert.equal(pricing.discount, 0)
  })

  it('calculates the amount due for 2.5hrs of parking', function () {
    var pricing = calculatePrice(car, '2016-01-25T18:30:00+00:00')

    assert.equal(pricing.amountDue, 2.4)
    assert.equal(pricing.discount, 0)
  })

  it('calculates the amount due for 3hrs of parking', function () {
    var pricing = calculatePrice(car, '2016-01-25T19:00:00+00:00')

    assert.equal(pricing.amountDue, 3.6)
    assert.equal(pricing.discount, 0)
  })

  it('calculates the amount due for 4hrs of parking', function () {
    var pricing = calculatePrice(car, '2016-01-25T20:00:00+00:00')

    assert.equal(pricing.amountDue, 4.7)
    assert.equal(pricing.discount, 0.10)
  })

  it('calculates the amount due for 5hrs of parking', function () {
    var pricing = calculatePrice(car, '2016-01-25T21:00:00+00:00')

    assert.equal(pricing.amountDue, 5.8)
    assert.equal(pricing.discount, 0.20)
  })

  it('returns 0 if parking date is in the future', function () {
    var pricing = calculatePrice(car, '2016-01-24T21:00:00+00:00')

    assert.equal(pricing.amountDue, 0)
    assert.equal(pricing.discount, 0)
  })
})
