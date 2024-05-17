const express = require("express");
const serverless = require("serverless-http");
const app = express();
const routes = require("./routes");

// CORS middleware to handle preflight requests
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, X-Amz-Date, X-Api-Key, X-Amz-Security-Token, Access-Control-Allow-Headers"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.log("Reached the error handling.");
  res.status(500).json({ error: "Something went wrong", message: err.message });
});

// Export the Express app wrapped in serverless-http ()
module.exports.handler = serverless(app);
