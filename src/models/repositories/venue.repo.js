"use strict";

const Venue = require("../venue.model");
const { NotFoundError } = require("../../core/error.response");
const { getSelectData, getUnSelectData } = require('../../utils/getter')

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
      "location.coordinates": [location.lng, location.lat]
    })
  }

  findAllVenue = async ({
    venueName,
    sportTypes,
    city,
    district,
    ward,
    street,
    venueLocation,
    radius = 1000,
  }, select, limit, skip) => {
    const query = {}
    
    if (venueName) {
      query.sport_types = { $in: sportTypes }
    }

    if (city) {
      query['location.city'] = { $regex: city, $option: 'i' }
    }

    if (district) {
      query['location.district'] = { $regex: district, $option: 'i' }
    }

    if (ward) {
      query['location.ward'] = { $regex: ward, $option: 'i' }
    }

    if (street) {
      query['location.street'] = { $regex: street, $option: 'i' }
    }

    if (venueLocation) {
      const { lng, lat } = venueLocation;
      query.location = {
        $near: {
          $geometry: {
              type: "Point",
              coordinates: [lng, lat]
          },
          $maxDistance: radius
        }
      };
    }

    return await this.queryVenue({ query, select, limit, skip })
  }

  findById = async (venueId) => {
    return await Venue.findById(venueId)
  }

  updateOne = async (venueId, updatedData) => {
    const updatedVenue = await Venue.findByIdAndUpdate(venueId, updatedData, {
      new: true,
      runValidators: true
    })
    
    return updatedVenue
  }

  deleteOne = async (venueId) => {
    const deletedVenue = await Venue.findByIdAndDelete(venueId);
    if (!deletedVenue) {
      throw new NotFoundError("Venue not found to delete")
    }
    return deletedVenue;
  }

  queryVenue = async({ query, select, limit, skip }) => {
    return await Venue.find(query).
      sort({ updateAt: -1 }).
      skip(skip).
      limit(limit).
      select(getSelectData(select)).
      lean().
      exec()
  }
}

module.exports = new VenueRepo()
