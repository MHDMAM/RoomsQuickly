const Facade = require('../../lib/facade')
const roomSchema = require('./schema')

class RoomFacade extends Facade {
  constructor() {
    super(roomSchema)
  }

  populateBidsById(roomId) {
    return this.Schema.findById(roomId)
      .populate('bids')
      .exec()
  }

  findByIdAndUpdate(id, update) {
    return this.Schema.findByIdAndUpdate(id, update, {
        new: true
      })
      .exec()
  }

  findPagination(roomId, skip, count) {
    return this.Schema.findOne({
        _id: roomId
      }, {
        bids: {
          $slice: [skip, count]
        }
      })
      .populate('bids')
      .lean()
      .exec()
  }

}

module.exports = new RoomFacade(roomSchema)