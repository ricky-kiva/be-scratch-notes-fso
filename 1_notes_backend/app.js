const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const notesRouter = require('./controllers/notes')

const app = express()

mongoose.set('strictQuery') // allow querying without strictly follow Schema

logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch(error => logger.error('error connecting to MongoDB:', error.message))

app.use(cors())
app.use(express.static('dist')) // make Express show static content from `dist` dir.
app.use(express.json()) // impl. json-parser on Express
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app