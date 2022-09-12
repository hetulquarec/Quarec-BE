const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {

    category: {
      type: String,
      required: true,
    },
    imgpath:{
        type: String,
        required: true,
    }
  },
  { timestamps: true }
);

const Gallery = mongoose.model("GALLERY", gallerySchema);
module.exports = Gallery;
