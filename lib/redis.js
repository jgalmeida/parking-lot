var config = require('../config')

var redis = require('redis')

var client = redis.createClient(config.redis)

client.on('error', function (err) {
  console.info('[Redis client error]', err)
})

module.exports = {
  client: client
}
