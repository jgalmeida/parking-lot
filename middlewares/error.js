module.exports = function (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }

  var status = err.isBoom ? err.output.statusCode : 500

  if (process.env.NODE_ENV !== 'test') {
    console.error(status + ' : ' + err.stack)
  }

  res.status(status).json({
    message: err.message
  })
}
