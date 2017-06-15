const config = require('../config')
const redis = require('redis')
const bluebird = require('bluebird')
const _ = require('lodash')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

function retryStrategy(options) {
  if (options.total_retry_time > 1000 * 60 * 60) {
    return new Error('Retry time exhausted')
  }
  if (options.attempt > 10) {
    // End reconnecting with built in error
    return undefined
  }
  // reconnect after
  return Math.min(options.attempt * 100, 3000)
}

const client = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
  retry_strategy: retryStrategy
})
client.select(0)
  // in case Redis server requires authentication.
  // client.authAsync(config.redis.password).then((err, reply) =>{/*.....*/});

client.onAsync('ready')
  .then(function() {
    console.log('Redis is ready')
  })

function getRoomsSet() {
  return client.keysAsync('ID_*')
    .then(keys => {
      if (_.isEmpty(keys)) return [];
      return client.mgetAsync(keys)
        .then(values => {
          let sortedValues = _.map(values, item => {
            return JSON.parse(item)
          })
          sortedValues = _.sortBy(sortedValues, 'start_bid')

          return sortedValues
        })
    })
}

function setRoomsSet(data) {
  if (!data) return Promise.reject(new Error('No data'))
  if (!_.isArray(data)) {
    data = [data]
  }
  let promises = []
  _.each(data, room => {
    let promise = new Promise((resolve, reject) => {
      client.setAsync(config.redis.keys.prefix + room._id, JSON.stringify(room))
        .then(success => {
          if (!success) return reject(new Error('radis failed'))
          return resolve()
        })
    })
    promises.push(promise)
  })

  return Promise.all(promises)
}


module.exports = {
  client,
  getRoomsSet,
  setRoomsSet
}