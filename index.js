const express = require("express");
const app = express();
const routes = require("./routes");

app.use("/", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.log("Reached the error handling.");
  res.status(500).json({ error: "Something went wrong", message: err.message });
});

const port = process.env.PORT || 9000;
app.listen(port, () => console.log("Listening on port...", port));
