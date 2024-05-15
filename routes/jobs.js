const express = require("express");
const router = express.Router();
const fs = require("fs");

// main route at /jobs
router.get("/", (req, res, next) => {
  fs.readFile("/boh", (err, data) => {
    if (err) {
      next(err);
    }
  });
});

module.exports = router;
