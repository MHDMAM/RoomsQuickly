const Controller = require('../../lib/controller')
const roomFacade = require('./facade')
const utils = require('./utils')
const moment = require('moment')

class RoomController extends Controller {
  constructor () {
    super(roomFacade)
  }

  getRooms () {
    return roomFacade.find({
      start_bid: {
        $gte: moment().toLocaleString(),
        $lt: moment().add(10, 'm').toLocaleString()
      }
    })
  }

  init (req, res) {
    return this.getRooms()
      .then(utils.cacheRooms)
      .then((succeed, failed) => {
        if (failed) {
          return res.status(500).json({
            error: 'Internal server error'
          })
        }

        return res.status(200).json({
          message: 'RoomsQuickly auction\'s started.'
        })
      }).catch(reason => {
        return res.status(500).json({
          error: 'Internal server error'
        })
      })
  }

  auctionRooms (req, res) {
    return utils.getCachedData()
      .then(values => {
        return res.status(200).json({
          data: values
        })
      })
      .catch(reason => {
        return res.status(500).json({
          error: 'Internal server error'
        })
      })
  }
}

module.exports = new RoomController(roomFacade)
