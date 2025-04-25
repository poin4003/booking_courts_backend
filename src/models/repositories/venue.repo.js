'use strict'

const Venue = require('../../models/venue.model')
const { NotFoundError} = require('../../core/error.response')

class VenueRepo {

  createOne = async (venueData) => {
      const newVenue = new Venue(venueData)  
      return await newVenue.save() 
    }
    findByName = async (name) => {
      return await Venue.findOne({ name })
    }
  
    findByAddress = async (address) => {
      return await Venue.findOne({ address })
    }
  
    findByPhone = async (phone) => {
      return await Venue.findOne({ phone })
    }
  
    findByLocation = async (location) => {
      return await Venue.findOne({
        'location.lat': location.lat,
        'location.lng': location.lng
      })
    }

    findAll = async () => {
      return await Venue.find()
    }

    findById = async (venueId) => {
      const venue = await Venue.findById(venueId)
      if (!venue) {
        throw new NotFoundError('Venue not found')
      }
      return venue
    }

  updateOne = async (venueId, updatedData) => {
      const updatedVenue = await Venue.findByIdAndUpdate(venueId, updatedData, { new: true })
      if (!updatedVenue) {
        throw new NotFoundError('Venue not found to update') 
      }
      return updatedVenue    
    }

  deleteOne = async (venueId) => {
      const deletedVenue = await Venue.findByIdAndDelete(venueId) 
      if (!deletedVenue) {
        throw new NotFoundError('Venue not found to delete')
      }
      return deletedVenue  
  }
}
module.exports = new VenueRepo()
