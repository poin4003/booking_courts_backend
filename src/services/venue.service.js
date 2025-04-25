'use strict'
const { BadRequestError,NotFoundError} = require('../core/error.response')
const VenueRepo = require('../models/repositories/venue.repo')  
const { getInfoData } = require('../utils/getter')
class VenueService {
    createVenue = async (venueData) => {
      if (!venueData.name || !venueData.address) {
        throw new BadRequestError('Missing required fields: name or address')
      }

      const existed = await VenueRepo.findDuplicateVenue(
        venueData.name,
        venueData.address,
        venueData.location
      )
      if (existed) {
        throw new BadRequestError('Venue already exists')
      }
      const newVenue = await VenueRepo.createOne(venueData)

  
      return newVenue
    }
  

    getAllVenues = async () => {
      const venues = await VenueRepo.findAll()
      if (!venues || venues.length === 0) {
        throw new NotFoundError('No venues found')
      }
      return venues
    }
  
    getVenueById = async (venueId) => {
      const venue = await VenueRepo.findById(venueId)
      if (!venue) {
        throw new NotFoundError('Venue not found')
      }
      return venue
    }
    updateVenue = async (venueId, updatedData) => {
      const updatedVenue = await VenueRepo.updateOne(venueId, updatedData)
      if (!updatedVenue) {
        throw new NotFoundError('Venue not found to update')
      }
  
      return updatedVenue
    }
  
    deleteVenue = async (venueId)=> {

      const deletedVenue = await VenueRepo.deleteOne(venueId)
      if (!deletedVenue) {
        throw new NotFoundError('Venue not found to delete')
      }
      return deletedVenue
    }
  }
  
  module.exports = new VenueService()