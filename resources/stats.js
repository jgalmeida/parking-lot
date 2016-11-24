module.exports = function (req, res, next) {
  var resp = {
    initTime: req.params.initTime
  }

  res.status(200).json(resp)
}
