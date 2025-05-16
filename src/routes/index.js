'use strict'

const express = require('express')
const router = express.Router()

router.use('/v1/api', require('./auth'))
router.use('/v1/api', require('./venues'))  
router.use('/v1/api', require('./booking'))

module.exports = router