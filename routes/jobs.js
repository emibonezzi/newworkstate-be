const express = require("express");
const router = express.Router();
const fs = require("fs");
const scrapeJobs = require("../handlers/scrapeJobs");

// main route at /jobs
router.get("/", scrapeJobs);

module.exports = router;
