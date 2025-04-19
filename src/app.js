const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')

// Init config
require('dotenv').config()

// Init db
require('./dbs/init.mongodb')

const app = express()

// Init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

// Init router
app.use('/', require('./routes'))

// Handle rrrors
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(err)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  let message = error.message || 'Internal Server Error'

  if (error.details && Array.isArray(error.details)) {
    message = error.details[0].message
  }

  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: message
  })
})


module.exports = app