'use strict'

const { OK, CREATED } = require('../core/success.response')
const VenueService = require('../services/venue.service') 

class VenueController {
    createVenue = async (req, res, next) => {
          const venueData = req.body 
          const newVenue = await VenueService.createVenue(venueData)

          new CREATED({
            message: 'Venue created successfully',
            metadata: newVenue
          }).send(res)
        }
        
  getAllVenues = async (req, res, next) => {
    const venues = await VenueService.getAllVenues()  
    new OK({
      message: 'Venues retrieved successfully',
      metadata: venues
    }).send(res)
  }

  getVenueById = async (req, res, next) => {
    const venueId = req.params.id
    const venue = await VenueService.getVenueById(venueId) 
    new OK({
      message: 'Venue retrieved successfully',
      metadata: venue
    }).send(res)
  }

  // Cập nhật venue
  updateVenue = async (req, res, next) => {
    const venueId = req.params.id
    const updatedData = req.body
    const updatedVenue = await VenueService.updateVenue(venueId, updatedData)  
    new OK({
      message: 'Venue updated successfully',
      metadata: updatedVenue
    }).send(res)
  }

  // Xóa venue
  deleteVenue = async (req, res, next) => {
    const venueId = req.params.id
    const deletedVenue = await VenueService.deleteVenue(venueId) 
    new OK({
      message: 'Venue deleted successfully',
      metadata: deletedVenue
    }).send(res)
  }
}

module.exports = new VenueController()
