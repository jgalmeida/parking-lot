var FindService = require('./find')

module.exports = {
  find: find
}

function find (req, res, next) {
  FindService(req.params, function (err, data) {
    if (err) {
      return next(err)
    }

    var status = data ? 200 : 204

    res.status(status).json(data)
  })
}
