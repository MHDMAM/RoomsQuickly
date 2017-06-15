const redis = require('../../lib/cache')
const config = require('../../config')
const _ = require('lodash')
const Rooms = require('./facade')

class Utils {
  static getCachedData() {
    return redis.getRoomsSet()
  }

  static cacheRooms(rooms, err) {
    if (err) {
      return Promise.reject(err)
    }

    return redis.setRoomsSet(rooms)
  }
}

module.exports = Utils