'use strict'

const express = require('express')
const VenueController = require('../../controllers/venue_controller') 
const { asyncHandler } = require('../../helpers/asyncHandler')  
const { validateBody } = require('../../middlewares/validator/validateHandler') 
const { venueValidationSchema } = require('../../dtos/venue_dto')
const { permission } = require('../../middlewares/auth/checkAuth')
const router = express.Router()

router.post('/venue/create', 
  validateBody(venueValidationSchema), 
  asyncHandler(VenueController.createVenue)
)

router.get('/venue/getAll', 
  asyncHandler(VenueController.getAllVenues)
)
router.get('/venue/:id', 
  asyncHandler(VenueController.getVenueById) 
)
router.put('/venue/:id', 
 
  validateBody(venueValidationSchema),
  asyncHandler(VenueController.updateVenue) 
)
router.delete('/venue/delete/:id', 
  asyncHandler(VenueController.deleteVenue) 
)

module.exports = router
