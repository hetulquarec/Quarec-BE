const mongoose = require("mongoose");
const newsletter = new mongoose.Schema({
  email: {
    type: String,
    required: false,
  },
},{timestamps: true});

const Newsletter = mongoose.model("NEWSLETTER", newsletter);
module.exports = Newsletter;
