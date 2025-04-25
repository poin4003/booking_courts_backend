'use strict'

const express = require('express')
const VenueController = require('../../controllers/venue_controller') 
const { asyncHandler } = require('../../helpers/asyncHandler')  
const { validateBody } = require('../../middlewares/validator/validateHandler') 
const { venueValidationSchema } = require('../../dtos/venue_dto')
const {authentication } = require('../../middlewares/auth/authUtils')
const router = express.Router()
router.post('/venue', 
  validateBody(venueValidationSchema), 
  asyncHandler(VenueController.createVenue)
)
router.get('/venue', 
  asyncHandler(VenueController.getAllVenues)
)
router.get('/venue/:id', 
  asyncHandler(VenueController.getVenueById) 
)
router.put('/venue/:id', 
  validateBody(venueValidationSchema),
  asyncHandler(VenueController.updateVenue) 
)
router.delete('/venue/:id', 
  asyncHandler(VenueController.deleteVenue) 
)

module.exports = router
