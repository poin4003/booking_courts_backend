"use strict";

const express = require("express");
const VenueController = require("../../controllers/venue_controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { 
  validateBody,
  validateQuery
} = require("../../middlewares/validator/validateHandler");
const { 
  createVenueValidationSchema, 
  updateVenueValidationSchema, 
  searchVenueValidationSchema 
} = require("../../dtos/venue_dto");
const { permission } = require("../../middlewares/auth/checkAuth");
const { authentication } = require("../../middlewares/auth/authUtils");
const router = express.Router();


router.get("/venue", 
  validateQuery(searchVenueValidationSchema),
  asyncHandler(VenueController.getAllVenues)
)
router.get("/venue/:id", asyncHandler(VenueController.getVenueById))

// authentication //
router.use(authentication)
////////////////////////

router.post(
  "/venue",
  //permission("ADMIN"),
  validateBody(createVenueValidationSchema),
  asyncHandler(VenueController.createVenue)
);

router.put(
  "/venue/:id",
  //permission("ADMIN"),
  validateBody(updateVenueValidationSchema),
  asyncHandler(VenueController.updateVenue)
);

router.delete(
  "/venue/:id",
  //permission("ADMIN"),
  asyncHandler(VenueController.deleteVenue)
);

module.exports = router;
