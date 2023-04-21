const mongoose = require("mongoose");

const schemaregister = mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  token: {
    type: String,
  },
});

const user = mongoose.model("user", schemaregister);

module.exports = user;
