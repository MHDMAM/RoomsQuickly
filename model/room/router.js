const controller = require('./controller')
const Router = require('express').Router
const router = new Router()

router.route('/start')
  .get((...args) => controller.init(...args))

router.route('/rooms')
  .get((...args) => controller.auctionRooms(...args))

module.exports = router
