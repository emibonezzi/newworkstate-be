const express = require("express");
const serverless = require("serverless-http");
const app = express();
const routes = require("./routes");

app.use("/", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.log("Reached the error handling.");
  res.status(500).json({ error: "Something went wrong", message: err.message });
});

// Export the Express app wrapped in serverless-http ()
module.exports.handler = serverless(app);
