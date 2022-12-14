const mongoose = require("mongoose");

const JobPostSchema = mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    jobTime: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    jobResponsibilities: {
      type: String,
      required: true,
    },
    jobRequirements: {
      type: String,
      required: true,
    },
    cloudinary_id: {
      type: String,
    },
  },
  { timestamps: true }
);
const JobPost = mongoose.model("JOBPOST", JobPostSchema);
module.exports = JobPost;
