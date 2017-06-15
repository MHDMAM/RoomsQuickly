'use strict'

const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
const chaiHttp = require('chai-http')
chai.use(chaiAsPromised)
chai.use(chaiHttp)
const should = chai.should()
const server = require('../../index')

// connect to db.
require('../../lib/mongo')
const redis = require('../../lib/cache');
const testdata = require('../../testdata')

describe('Room Module', () => {
  beforeEach(function*() {
    const Bids = require('./facade')
    const Rooms = require('../room/facade')
    yield Rooms.remove()
    yield Bids.remove()

    yield redis.client.flushdbAsync()

    // insert test data:
    let testRoom = testdata.rooms[1];
    let testbid = testdata.bids[0];
    testRoom.winner = testbid._id;
    testRoom.bids.push(testbid._id)
    yield Bids.create(testbid)
    yield Rooms.create(testRoom)
    yield redis.setRoomsSet(testRoom)
  })

  it('/POST bid should return 200 with json res', (done) => {

    chai.request(server)
      .post('/bid')
      .send({
        'roomId': '593e3c8d2c05f81ff4fc3e30',
        'amount': '1600',
        'backend_url': 'www.url.com'
      })
      .end((err, res) => {
        res.should.have.status(200)
        expect(res).to.be.json
        done()
      })
  })

  it('/get is bid a winner by id should return 200 with json res', (done) => {

    chai.request(server)
      .get('/bid/' + testdata.bids[0]._id)
      .end((err, res) => {
        res.should.have.status(200)
        expect(res).to.be.json
        done()
      })
  })

  before(function*() {
    const Bids = require('./facade')
    const Rooms = require('../room/facade')
    yield Rooms.remove()
    yield Bids.remove()

    yield redis.client.flushdbAsync()

    // insert test data:
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



  })
  it('/get room/:id&page:1  should return 200 with json res list of bids on the room', (done) => {
    chai.request(server)
      .get('/bid/room/' + testdata.rooms[1]._id)
      .query({
        page: 0
      })
      .end((err, res) => {
        res.should.have.status(200)
        expect(res).to.be.json
        return done()
      })
  })
})