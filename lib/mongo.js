const mongoose = require('mongoose')
const config = require('../config')

mongoose.Promise = global.Promise
mongoose.connect(config.mongo.url)

mongoose.connection.on('error', function (err) {
  console.error(`Error: Mongo connection: ${err} \nUnable to connect to database at ${config.mongo.url}`)
})

mongoose.connection.on('connected', function () {
  console.info(`Mongo is ready \nMongo connected at ${config.mongo.url}`)
})

mongoose.connection.once('open', function () {
  console.log(`Mongo connection opened!`)
})

mongoose.connection.on('reconnected', function () {
  console.info('Mongo reconnected!')
})

mongoose.connection.on('disconnected', function () {
  console.error(`Mongo disconnected!\nReconnecting in: ${config.mongo.timeout}`)
  mongoose.connect(config.mongo.url, config.mongo.timeout)
}, config.mongo.timeout)

module.exports = mongoose
