'use strict'

const { model, Schema } = require('mongoose')
const { 
  USER_DOCUMENT_NAME, 
  USER_COLLECTION_NAME,
} = require('../consts/models.const')

const userSchema = new Schema({
  name: {
    type: String, 
    trim: true,
    maxLength: 150
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  }, 
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  }, 
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },
  role: {
    type: Array,
    default: []
  }
}, {
  timestamps: true,
  collection: USER_COLLECTION_NAME
})

module.exports = model(USER_DOCUMENT_NAME, userSchema)