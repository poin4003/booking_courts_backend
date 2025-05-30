"use strict";

const cron = require("node-cron");
const VenueRepo = require("../models/repositories/venue.repo");

async function resetSlotsNow() {
  try {
    await VenueRepo.updateSlotToAvailable();
    console.log("Slots status reset immediately on module load.");
  } catch (error) {
    console.error("Error resetting slots status on module load: ", error);
  }
}

resetSlotsNow();

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Running scheduled job: Resetting slots status to 'available'...");
    await VenueRepo.updateSlotToAvailable();
    console.log("Slots status reset complete.");
  } catch (error) {
    console.error("Error resetting slots status:  ", error);
  }
});

console.log("Reset slot cronjob started");
