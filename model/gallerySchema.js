const mongoose = require("mongoose");
const Gallery = new mongoose.Schema(
  {
    category: {
      type: String,
    },
    image: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GALLERY", Gallery);
