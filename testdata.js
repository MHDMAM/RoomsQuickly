const moment = require('moment')
const mongoose = require('mongoose')

let data = {
  rooms: [{
    name: 'superior rooms #1',
    minimal_bid: 888,
    start_bid: new Date(moment().add(20, 'm').toLocaleString()),
    room_id: mongoose.Types.ObjectId()
  }, {
    _id: mongoose.Types.ObjectId('593e3c8d2c05f81ff4fc3e30'),
    name: 'superior rooms #2',
    minimal_bid: 1500,
    start_bid: new Date(moment().toLocaleString()),
    room_id: mongoose.Types.ObjectId(),
    bids:[],
    winner:null
  }, {
    name: 'superior rooms #3',
    minimal_bid: 1500,
    start_bid: new Date(moment().toLocaleString()),
    room_id: mongoose.Types.ObjectId()
  }, {
    _id: mongoose.Types.ObjectId('5940c433d91c0d2cd02beb65'),
    name: 'deluxe rooms #1',
    minimal_bid: 1500,
    start_bid: new Date(moment().subtract(9, 'm').toLocaleString()),
    room_id: mongoose.Types.ObjectId(),
    bidingTime: 10
  }, {
    name: 'deluxe rooms #2',
    minimal_bid: 1500,
    start_bid: new Date(moment().toLocaleString()),
    room_id: mongoose.Types.ObjectId()
  }, {
    name: 'deluxe rooms #3',
    minimal_bid: 1500,
    start_bid: new Date(moment().toLocaleString()),
    room_id: mongoose.Types.ObjectId()
  }],
  bids: [{
    _id: mongoose.Types.ObjectId('5940d991f1519c32a4746a00'),
    backend_url: 'www.new.com',
    amount: 1700
  }]
}

module.exports = data