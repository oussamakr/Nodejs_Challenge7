const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/Auth")
  .then(() => {
    console.log("Succussfuly Connect to database");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = mongoose;
