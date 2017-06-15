const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const config = require('./config')
const routes = require('./routes')
require('./lib/cache')
require('./lib/mongo')

const app = express()

app.use(helmet())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(morgan('tiny'))

app.use('/', routes)

app.listen(config.server.port, () => {
  console.info(`Magic happens on port ${config.server.port}`)
})

process.on('uncaughtException', (err) => {
  console.error(`Caught exception: ${err}\n`)
})

module.exports = app
