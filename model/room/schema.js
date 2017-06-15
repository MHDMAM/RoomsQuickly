const mongoose = require('../../lib/mongo')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const roomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  minimal_bid: {
    type: Number,
    required: true
  },
  room_id: {
    type: ObjectId,
    required: true
  },
  winner: {
    type: ObjectId,
    ref: 'Bid',
  },
  bidingTime: {
    type: Number,
    default: 10
  },
  bids: [{
    type: ObjectId,
    ref: 'Bid',
    default: []
  }],
  start_bid: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('Room', roomSchema)