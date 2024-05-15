const express = require("express");
const router = express.Router();

// collect routes
const jobsRouter = require("./jobs");

// every endpoint has now its dedicated file in routes folder
router.use("/jobs", jobsRouter);

module.exports = router;
