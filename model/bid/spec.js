'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect

// connect to db.
require('../../lib/mongo')

const redis = require('../../lib/cache')
const config = require('../../config')
const controller = require('./controller')
const utils = require('./utils')
const testdata = require('../../testdata')

const Bids = require('./facade')
const Rooms = require('../room/facade')

chai.use(chaiAsPromised)
describe('Bid Module', () => {

  describe('bid', () => {
    it('Utils: getRoomById should export a promise function', () => {
      const rooms = utils.getRoomById()
      expect(utils.getRoomById).to.be.a('function')
      expect(rooms.then).to.be.a('function')
      expect(rooms.catch).to.be.a('function')
    })

    it('Utils: getRoomById should Return a room', function*() {
      let testRoom = testdata.rooms[1];
      yield redis.setRoomsSet(testRoom)
      const room = yield utils.getRoomById(testRoom._id)

      expect(room).to.be.an('Object')
      expect(room).to.have.property('_id')
      expect(room._id.toString()).to.equal(testdata.rooms[1]._id.toString())

    })

    it('Utils: validateAmount Should export a promise function', () => {
      const rooms = utils.validateAmount()
      expect(utils.validateAmount).to.be.a('function')
      expect(rooms.then).to.be.a('function')
      expect(rooms.catch).to.be.a('function')
    })

    it('Utils: validateAmount Should fail', function() {
      const promise = utils.validateAmount(testdata.rooms[1], 1500, 'www.google.com')
      return expect(promise).to.be.rejectedWith('your bid is less than the minimal bid required.')
    })

    it('Utils: backendCall should succeed ', function*() {
      let call = yield utils.backendCall('url')
      return expect(call).to.be.an('object')
    })

    it('Utils: validateBidTime: should update the biding time', function*() {
      yield redis.client.flushdbAsync()
      yield Rooms.remove()
      yield Bids.remove()

      let testRoom = testdata.rooms[3];
      yield redis.setRoomsSet(testRoom)
      yield Rooms.create(testRoom)

      const updatedRoom = yield utils.validateBidTime(testRoom);
      expect(updatedRoom).to.be.an('object')
      return expect(updatedRoom.bidingTime).to.equal(11)

    })

    it('Utils: createNewBid: should return bid object', function*() {
      // clear dbs:
      yield redis.client.flushdbAsync()
      yield Rooms.remove()
      yield Bids.remove()
        // insert test data:
      let testRoom = testdata.rooms[1];
      yield redis.setRoomsSet(testRoom)
      yield Rooms.create(testRoom)

      let newBid = yield utils.createNewBid(testRoom, 'www.test.com', 1000)

      expect(newBid).to.be.an('object')
    })

    it('Utils: validateAmount Should pass with the first bider', function*() {
      // clear dbs:
      yield redis.client.flushdbAsync()
      yield Rooms.remove()
      yield Bids.remove()
        // insert test data:
      let testRoom = testdata.rooms[1];
      yield Rooms.create(testRoom)
      yield redis.setRoomsSet(testRoom)

      const validBid = yield utils.validateAmount(testRoom, 1600, 'www.old.com')
      return expect(validBid).to.be.true
    })

    it('Utils: validateAmount Should pass bider', function*() {
      // depends on previous test's data:
      let cachedRooms = yield redis.getRoomsSet()

      const promise = yield utils.validateAmount(cachedRooms[0], 1700, 'www.new.com')
      return expect(promise).to.equal(true);

    })

    it('Utils: getWinnerBid Should return the room object ', function*() {
      yield redis.client.flushdbAsync()
      yield Rooms.remove()
      yield Bids.remove()
      let testRoom = testdata.rooms[1];
      let testbid = testdata.bids[0];
      testRoom.winner = testbid._id;
      testRoom.bids.push(testbid._id)

      yield Rooms.create(testRoom)
      yield Bids.create(testbid)
      yield redis.setRoomsSet(testRoom)
      const room = yield utils.getWinnerBid(testbid._id)
      return expect(room).to.be.an('object');

    })

    it('Utils: getWinnerBid Should return null ', function*() {
      yield redis.client.flushdbAsync()
      yield Rooms.remove()
      yield Bids.remove()

      let testbid = testdata.bids[0];
      const room = yield utils.getWinnerBid(testbid._id)
      return expect(room).to.be.a('null');

    })

    it('Utils: getBidsPagination ', function*() {
      yield redis.client.flushdbAsync()
      yield Bids.remove()
      yield Rooms.remove()

      var room = testdata.rooms[1]
      room.bids = [];
      for (let i = 1; i <= 10; i++) {
        let bid = yield Bids.create({
          bid_id: require('../../lib/mongo').Schema.ObjectId(),
          amount: i * 1000,
          backend_url: 'url'
        })
        
        room.bids.push(bid)
        room.winner = bid._id
      }

      yield Rooms.create(room)

      let list = yield utils.getBidsPagination(room._id, 1)
      console.log(list);

      expect(list).to.be.an('array')
      expect(list).to.have.length(3)
      expect(list[0]).to.have.property('winner')
      expect(list[0]).to.have.property('amount')


    })

  })
})