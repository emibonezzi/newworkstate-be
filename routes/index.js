const express = require("express");
const router = express.Router();

// collect routes
const jobsRouter = require("./jobs");

// every endpoint has now its dedicated module
router.use("/jobs", jobsRouter);

module.exports = router;
