"use strict";

const express = require("express");
const VenueController = require("../../controllers/venue_controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { validateBody } = require("../../middlewares/validator/validateHandler");
const { venueValidationSchema } = require("../../dtos/venue_dto");
const { permission } = require("../../middlewares/auth/checkAuth");
const { authentication } = require("../../middlewares/auth/authUtils");
const router = express.Router();

router.post(
  "/venue/create",
  authentication,
  permission("ADMIN"),
  validateBody(venueValidationSchema),
  asyncHandler(VenueController.createVenue)
);

router.get("/venue/getAll", asyncHandler(VenueController.getAllVenues));

router.get("/venue/:id", asyncHandler(VenueController.getVenueById));

router.put(
  "/venue/:id",
  authentication,
  permission("ADMIN"),
  validateBody(venueValidationSchema),
  asyncHandler(VenueController.updateVenue)
);

router.delete(
  "/venue/delete/:id",
  authentication,
  permission("ADMIN"),
  asyncHandler(VenueController.deleteVenue)
);

module.exports = router;
