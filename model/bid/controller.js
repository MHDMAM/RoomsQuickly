const Controller = require('../../lib/controller')
const bidFacade = require('./facade')
const utils = require('./utils')

class BidController extends Controller {
  constructor() {
    super(bidFacade)
  }

  doBid(roomId, amount, backend_url) {
    return utils.getRoomById(roomId)
      .then(room => {
        return utils.validateAmount(room, amount, backend_url)
      })
  }

  getWinnerBid(bidId) {
    return utils.getWinnerBid(bidId)
  }

  bid(req, res) {
    const {
      roomId,
      amount,
      backend_url
    } = req.body;
    this.doBid(roomId, amount, backend_url)
      .then((succeed) => {
        return res.status(200).json({
          winner: !!succeed
        })
      })
      .catch(reason => {
        return res.status(500).json({
          error: 'Internal server error'
        })
      })

  }

  winnerBid(req, res) {
    let id = req.params.id
    this.getWinnerBid(id)
      .then((succeed) => {

        return res.status(200).json({
          winner: !!succeed
        })
      })
      .catch(reason => {
        return res.status(500).json({
          error: 'Internal server error'
        })
      })
  }

  bidsByRoomId(req, res) {
    let roomId = req.params.id
    let page = req.query.page || 0
    return utils.getBidsPagination(roomId, page)
      .then((bidsList) => {
        return res.status(200).json({
          data: bidsList
        })
      })
      .catch(reason => {
        return res.status(500).json({
          error: 'Internal server error'
        })
      })
  }

}

module.exports = new BidController(bidFacade)