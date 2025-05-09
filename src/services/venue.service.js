"use strict"

const { BadRequestError, NotFoundError } = require("../core/error.response")
const VenueRepo = require("../models/repositories/venue.repo")
const { getInfoData } = require("../utils/getter")

class VenueService {
  createVenue = async (venueData) => {
    if (await VenueRepo.findByName(venueData.name)) {
      throw new BadRequestError("Venue name already exists")
    } 
    if (await VenueRepo.findByPhone(venueData.phone)) {
      throw new BadRequestError("Venue phone already exists")
    }
    if (await VenueRepo.findByLocation(venueData.location)) {
      throw new BadRequestError("Venue location already exists")
    }

    const newVenue = await VenueRepo.createOne(venueData)
    return newVenue
  }

  getAllVenues = async (searchParams = {}) => {
    const page = parseInt(searchParams.page) || 1;
    const limit = parseInt(searchParams.limit) || 20;
    const skip = (page - 1) * limit;

    const select = [
      'name',
      'location.full_address',
      'sport_types',
      'amenities',
      'images',
    ]

    const query = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value != null && value !== '')
    )

    const venues = await VenueRepo.findAllVenue(query, select, limit, skip);
    return venues;
  }

  getVenueById = async (venueId) => {
    const venue = await VenueRepo.findById(venueId);
    if (!venue) {
      throw new BadRequestError("Venue not found");
    }
    return venue;
  };

  updateVenue = async (venueId, updatedData) => {
    const existingVenue = await VenueRepo.findById(venueId)
    if (!existingVenue) {
      throw new BadRequestError("Venue does not exist")
    }

    const updatedVenue = await VenueRepo.updateOne(venueId, updatedData)
    return updatedVenue;
  };

  deleteVenue = async (venueId) => {
    const deletedVenue = await VenueRepo.deleteOne(venueId);
    if (!deletedVenue) {
      throw new NotFoundError("Venue not found to delete");
    }
    return deletedVenue;
  };
}

module.exports = new VenueService();
