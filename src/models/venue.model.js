'use strict'
const { model, Schema } = require('mongoose')
const { 
  VENUE_DOCUMENT_NAME, 
  VENUE_COLLECTION_NAME,
} = require('../consts/models.const')
const venueSchema = new Schema({
    name: {
      type: String, 
     required: true,
    
    },
    address: {
      type: String, 
      required: true
    },
    location: {
      lat: {
        type: Number, 
        required: true
      },
      lng: {
        type: Number, 
        required: true
      }
    },
    sport_types: [{
      type: String
    }],
    amenities: [{
      type: String
    }],
    images: [{
      type: String
    }],
    slots: [{
      date: {
        type: Date, 
        required: true
      },
      time: {
        type: String, 
        required: true
      },
      price: {
        type: Number, 
        required: true
      },
      status: {
        type: String, 
        enum: ['available', 'booked', 'pending'], 
        default: 'available'
      }
    }],
    deals: [{
      type: String
    }]
  }, { 
    timestamps: true ,
    collection: VENUE_COLLECTION_NAME
});
module.exports = model(VENUE_DOCUMENT_NAME, venueSchema)