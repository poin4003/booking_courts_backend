'use strict'

const Venue = require('../../models/venue.model')
const { NotFoundError, BadRequestError } = require('../../core/error.response')

class VenueRepo {

  createOne = async (venueData) => {
    try {
      const newVenue = new Venue(venueData)  
      return await newVenue.save() 
    } catch (error) {
      throw new BadRequestError(error.message)  
    }
  }
  findDuplicateVenue = async (name, address, location) => {
    return await Venue.findOne({
      name,
      address,
      'location.lat': location.lat,
      'location.lng': location.lng
    })
  }

  findAll = async () => {
    try {
      return await Venue.find()  
    } catch (error) {
      throw new BadRequestError('Error fetching venues')
    }
  }

  findById = async (venueId) => {
    try {
      const venue = await Venue.findById(venueId)  
      if (!venue) {
        throw new NotFoundError('Venue not found') 
      }
      return venue  
    } catch (error) {
      throw error  
    }
  }
  updateOne = async (venueId, updatedData) => {
    try {
      const updatedVenue = await Venue.findByIdAndUpdate(venueId, updatedData, { new: true })
      if (!updatedVenue) {
        throw new NotFoundError('Venue not found to update') 
      }
      return updatedVenue  
    } catch (error) {
      throw error  
    }
  }

  // Xóa venue theo ID
  deleteOne = async (venueId) => {
    try {
      const deletedVenue = await Venue.findByIdAndDelete(venueId) 
      if (!deletedVenue) {
        throw new NotFoundError('Venue not found to delete')
      }
      return deletedVenue  
    } catch (error) {
      throw error 
    }
  }
}

module.exports = new VenueRepo()
