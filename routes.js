const Router = require('express').Router
const router = new Router()

const room = require('./model/room/router')
const bid = require('./model/bid/router')

router.route('/').get((req, res) => {
  res.json({
    message: 'Welcome to RoomsQuickly bidding API!'
  })
})

router.use('/room', room)
router.use('/bid', bid)

router.use('*', (req, res) => res.status(404).json({
  error: 'page not fount'
}))

module.exports = router
