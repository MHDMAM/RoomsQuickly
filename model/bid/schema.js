const mongoose = require('../../lib/mongo')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const bidSchema = new Schema({
  bid_id: {
    type: ObjectId
  },
  amount: {
    type: Number,
    required: true
  },
  backend_url: {
    type: String,
    required: true
  }
})

bidSchema.plugin(require('mongoose-paginate'))
module.exports = mongoose.model('Bid', bidSchema)
