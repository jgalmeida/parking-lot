module.exports = function (req, res, next) {
  req.params.initTime = req.app.get('initTime')
  next()
}
