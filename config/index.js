var ENV = process.env.NODE_ENV || 'dev'

module.exports = require('./' + ENV)
