"use strict";

const express = require("express");
const VenueController = require("../../controllers/venue.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const {
  validateBody,
  validateQuery,
} = require("../../middlewares/validator/validateHandler");
const {
  createVenueValidationSchema,
  updateVenueValidationSchema,
  searchVenueValidationSchema,
} = require("../../dtos/venue_dto");
const { permission } = require("../../middlewares/auth/checkAuth");
const { authentication } = require("../../middlewares/auth/authUtils");
const { RoleAdmin } = require("../../consts/role.const");
const router = express.Router();

router.get(
  "/venue",
  validateQuery(searchVenueValidationSchema),
  asyncHandler(VenueController.getAllVenues)
);
router.get("/venue/:id", asyncHandler(VenueController.getVenueById));

// authentication //
router.use(authentication);
////////////////////////

// admin permission //
router.use(permission("ADMIN"));
///////////////////////

router.post(
  "/venue",
  validateBody(createVenueValidationSchema),
  asyncHandler(VenueController.createVenue)
);

router.put(
  "/venue/:id",
  validateBody(updateVenueValidationSchema),
  asyncHandler(VenueController.updateVenue)
);

router.delete("/venue/:id", asyncHandler(VenueController.deleteVenue));

module.exports = router;
