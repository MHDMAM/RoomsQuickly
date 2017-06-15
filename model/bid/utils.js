const redis = require('../../lib/cache')
const _ = require('lodash')
const minimalIncrease = 1.05;
const Room = require('../room/facade')
const Bid = require('./facade')
const moment = require('moment')
const rp = require('request-promise')

class Utils {
  static getRoomById(roomId) {
    return new Promise((resolve, reject) => {
      return redis.getRoomsSet()
        .then(rooms => {
          let found = _.find(rooms, room => {
            return room._id == roomId
          })

          if (!found) return reject(new Error('Room not found'))
          return resolve(found)
        })
    })
  }

  static updateMongoAndRedis(roomId, updateObj) {
    return new Promise(function(resolve, reject) {
      Room.findByIdAndUpdate(roomId, updateObj)
        .then(updatedRoom => {
          redis.setRoomsSet(updatedRoom).then(() => {
            return resolve(updatedRoom)
          })
        })
    });
  }

  // call the no more winner bid.
  static backendCall(url) {
    var options = {
      method: 'POST',
      uri: 'http://jsonplaceholder.typicode.com/posts', // url
      body: {
        message: 'Your bid in not the winner bid anymore.'
      },
      json: true // Automatically stringifies the body to JSON
    };
    return rp(options)
      .then(function(parsedBody) {
        console.log('parsedBody', parsedBody);
        return parsedBody
      })
      .catch(function(err) {
        console.log('err', err);
        return new Error(err)
      });
  }

  static validateBidTime(room) {
    // if diff(now, room.start_bid + room.bidingTime)<=1 (mins)
    // room.bidingTime++
    // update mongo
    // update redis
    return new Promise(function(resolve, reject) {
      let bidEnds = moment(room.start_bid).add(room.bidingTime, 'm')
      let diff = bidEnds.diff(moment(), 's')
      if (diff <= 60) {
        Utils.updateMongoAndRedis(room._id, {
            $inc: {
              bidingTime: 1
            }
          })
          .then((updatedRoom) => {
            redis.setRoomsSet(updatedRoom).then(() => {
              return resolve(updatedRoom)
            })
          })
      } else {
        return resolve(true)
      }
    });
  }

  static createNewBid(room, backend_url, amount) {
    return new Promise(function(resolve, reject) {
      Bid.create({
          backend_url,
          amount
        })
        .then(function(bid) {
          var updateRoom = Utils.updateMongoAndRedis(room._id, {
              $push: {
                bids: bid._id
              }
            })
            .then(() => {
              return resolve(bid)
            })

        })
    });
  }

  static validateAmount(room, amount, backend_url) {
    return new Promise((resolve, reject) => {
      if (!room) return reject(new Error('Room is required'))
      Utils.validateBidTime(room)
      return Utils.createNewBid(room, backend_url, amount)
        .then((bid) => {

          if (room.bids && room.bids.length > 0) {
            return Room.populateBidsById(room._id)
              .then(room => {
                // find the max room.bids.amount and make sure room.bids.amount < minimalIncrease * amount
                // if succeed.. 
                //    call old winner's (max room.bids.amount) backend_url as losser.
                // else call this.backend_url as losser

                let maxBid = _.maxBy(room.bids, 'amount')
                if (minimalIncrease * amount > maxBid.amount) {
                  Utils.backendCall(maxBid.backend_url)

                  // new bidder is winner
                  Utils.updateMongoAndRedis(room._id, {
                    $set: {
                      winner: bid._id
                    }
                  })
                  return resolve(true)

                } else {
                  // new bidder is losser.
                  Utils.backendCall(backend_url)
                  return resolve(false)
                }
              })
          } else if (amount > minimalIncrease * room.minimal_bid) {

            // new bidder is winner
            Utils.updateMongoAndRedis(room._id, {
              $set: {
                winner: bid._id
              }
            })
            return resolve(true)
          }

          return reject(new Error('your bid is less than the minimal bid required.'))
        })

    })
  }

  static getWinnerBid(bidId) {
    return Room.findOne({
        winner: bidId
      })
      .then(room => {
        return room
      })
  }

  static getBidsPagination(roomId, page) {
    let pageCount = 3;
    let skip = (page - 1) * pageCount
  return Room.findPagination(roomId, skip, pageCount)
    .then(room => {
      let bids = _.map(room.bids, bid => {
        let tmp = _.omit(bid, ['__v', '_id'])
        if (tmp._id === room.winner)
          tmp.winner = true;
        tmp.winner = false
        return tmp;
      })
      return bids
    })
}
}

module.exports = Utils