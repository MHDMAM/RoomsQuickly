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
const redis = require('../../lib/cache').client

describe('Room Module', () => {
  before(function * () {
    const Room = require('./schema')
    const testdata = require('../../testdata').rooms
    yield Room.remove()
    yield Room.collection.insert(testdata)
    yield redis.flushdbAsync()
  })

  it('/GET start should return 200 with json res', (done) => {
    chai.request(server)
      .get('/room/start')
      .end((err, res) => {
        res.should.have.status(200)
        expect(res).to.be.json
        done()
      })
  })

  it('/GET start should return 200 with json res', (done) => {
    chai.request(server)
      .get('/room/rooms')
      .end((err, res) => {
        res.should.have.status(200)
        expect(res).to.be.json
        expect(res.body.data).to.be.an('array')
        done()
      })
  })
})
