const controller = require('./controller')
const Router = require('express').Router
const router = new Router()
const queue = require('express-queue')

router.route('/')
  .post(queue({ activeLimit: 1 }),(...args) => controller.bid(...args))

router.route('/:id')
  .get((...args) => controller.winnerBid(...args))

router.route('/room/:id')
  .get((...args) => controller.bidsByRoomId(...args))

module.exports = router
