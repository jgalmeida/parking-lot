var async = require('async')
var Joi = require('joi')
var Boom = require('boom')

var config = require('../../config')
var Parking = require('../../db/parking')

var Schema = Joi.object().keys({
  brand: Joi.string().required(),
  licenseplate: Joi.string().required(),
  parkinglotid: Joi.number().required(),
  parkingtime: Joi.date().required()
})

module.exports = function (params, cache, callback) {
  var opts = {
    car: params,
    cache: cache
  }

  var tasks = [
    async.constant(opts),
    validateSchema,
    mapData,
    create
  ]

  async.waterfall(tasks, after)

  function after (err, data) {
    if (err) {
      return callback(err)
    }

    callback(null, data)
  }
}

function validateSchema (params, next) {
  var validation = Joi.validate(params.car, Schema)

  if (validation.error) {
    return next(Boom.badRequest(validation.error))
  }

  next(null, params)
}

function mapData (params, next) {
  var parkingTime = new Date(params.car.parkingtime)

  params.car.parkingyear = parkingTime.getFullYear()
  params.car.parkingmonth = parkingTime.getMonth()
  params.car.parkingday = parkingTime.getDate()

  next(null, params)
}

function create (params, next) {
  var parkinglotKey = 'parkinglot:' + params.car.parkinglotid + ':total'

  params.cache.incr(parkinglotKey, function (err, total) {
    if (err) {
      return next(Boom.badImplementation(err))
    }

    if (Number(total) > config.maxCars) {
      params.cache.decr(parkinglotKey, function (err, total) {
        if (err) {
          return next(Boom.badImplementation(err))
        }

        return next(Boom.badRequest('Parking lot ' + params.car.parkinglotid + ' is full'))
      })
    } else {
      var model = new Parking(params.car)

      model.save(function (err) {
        if (err) {
          return next(Boom.badImplementation(err))
        }

        next(null, params)
      })
    }
  })
}
