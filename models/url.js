const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originUrl: { type: String, required: true },
  hashUrl: String,
});

module.exports = mongoose.model("Url", urlSchema);
