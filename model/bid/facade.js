const Facade = require('../../lib/facade')
const bidSchema = require('./schema')

class BidFacade extends Facade {
  constructor() {
    super(bidSchema)
  }
}

module.exports = new BidFacade(bidSchema)