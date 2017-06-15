'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect
const testdata = require('../../testdata').rooms
const config = require('../../config')

// connect to db.
require('../../lib/mongo')
const redis = require('../../lib/cache')

const controller = require('./controller')
const utils = require('./utils')

const Rooms = require('./schema')
const Bids = require('../bid/facade')

describe('Room Module', () => {
  before(function*() {
    yield Rooms.remove()
    yield Rooms.collection.insert(testdata)
  })

  beforeEach(function*() {
    yield redis.client.flushdbAsync()
  })

  describe('Init Auction Rooms', () => {
      it('getRooms: should export a promise function', () => {
        const rooms = controller.getRooms()
        expect(controller.getRooms).to.be.a('function')
        expect(rooms.then).to.be.a('function')
        expect(rooms.catch).to.be.a('function')
      })

      it('getRooms: should return array of rooms', () => {
        const initData = controller.getRooms()
        return initData.then((rooms, error) => {
          expect(rooms).to.be.an('array')
          expect(error).to.be.an('undefined')
        })
      })

      it('getRooms: should load auctionable rooms', function*() {
        const auctionableRooms = yield controller.getRooms()
        expect(auctionableRooms).to.be.an('array')
        expect(auctionableRooms).to.have.length(4)
      })

      it('Utils: cacheRooms: should export a promise function', function*() {
        const cache = utils.cacheRooms([], false)
        expect(utils.cacheRooms).to.be.a('function')
        expect(cache.then).to.be.a('function')
        expect(cache.catch).to.be.a('function')
      })

      it('Utils: cacheRooms: should save data to Redis', function*() {
        yield utils.cacheRooms(testdata)
        const redisroom = yield redis.getRoomsSet(config.redis.keys.auctionRooms)
        expect(redisroom).to.be.an('array')
      })

      it('Utils: getCachedData: should export a promise function', function*() {
        const auctionRooms = utils.getCachedData()
        expect(utils.getCachedData).to.be.a('function')
        expect(auctionRooms.then).to.be.a('function')
        expect(auctionRooms.catch).to.be.a('function')
      })

      it('Utils: getAuctionRooms: should return array of active auction rooms', function*() {
        const data = yield controller.getRooms()
        yield utils.cacheRooms(data)
        const auctionRooms = yield utils.getCachedData()
        expect(auctionRooms).to.be.an('array')
      })
  })
})