var FindService = require('./find')
var CreateService = require('./create')
var cache = require('../../lib/redis').client

module.exports = {
  find: find,
  create: create
}

function find (req, res, next) {
  FindService(req.params, res, next)
}

function create (req, res, next) {
  CreateService(req.body, cache, function (err, data) {
    if (err) {
      return next(err)
    }

    res.sendStatus(201)
  })
}
