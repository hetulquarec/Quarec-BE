const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const mongoose = require("mongoose");
const moment = require("moment");
const multer = require("multer");
require("../db/conn");
const Candidate = require("../model/candidateSchema");
const Employer = require("../model/employerSchema");
const Contactus = require("../model/contactusShcema");
const Newsletter = require("../model/newsletterSchema");
const JobPost = require("../model/jobPostSchema");
const Gallery = require("../model/gallerySchema");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

// Create new Candidate  Registration api
router.post("/candidate", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    //  Create  new Candidate Registrationwith file

    const Candidatepost = new Candidate({
      name: req.body.candidate,
      number: req.body.number,
      email: req.body.email,
      password: req.body.password,
      cpassword: req.body.cpassword,
      file: result.secure_url,
      cloudinary_id: result.public_id,
    });
    await Candidatepost.save();
    res.json(Candidatepost);
  } catch (err) {
    console.log(err);
  }
});

//  Get candidate data
router.get("/candidate", async (req, res) => {
  try {
    const candidate = await Candidate.find();
    res.status(200).send(candidate);
    console.log("-------Candidate----------", candidate);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create new employer Registration api
router.post("/employer", upload.single("file"), async (req, res) => {
  try {
    //  Create  new Candidate Registrationwith file
    const result = await cloudinary.uploader.upload(req.file.path);

    //  Create new Employee registration with file
    const Employepost = new Employer({
      industry: req.body.industry,
      companyName: req.body.companyName,
      fullName: req.body.fullName,
      number: req.body.number,
      email: req.body.email,
      password: req.body.password,
      cpassword: req.body.cpassword,
      file: result.secure_url,
      cloudinary_id: result.public_id,
    });
    await Employepost.save();
    res.json(Employepost);
  } catch (err) {
    console.log(err);
  }
});

// Get Employers
router.get("/employer", async (req, res) => {
  try {
    const employer = await Employer.findOne();
    res.status(200).send(employer);
    console.log("------Employer data---------", employer);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Candidate Login Api
router.post("/candidateLogin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    console.log(email, password);
    const candidateLogin = await Candidate.findOne({ email: email });
    if (candidateLogin) {
      const isMatch = await bcrypt.compare(password, candidateLogin.password);
      if (!isMatch) {
        res.status(400).json({ error: " Please Fill the Data" });
      } else {
        token = await candidateLogin.generateAuthToken();
        console.log(token);
        res.cookie("jwttoken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true,
        });
        res.json({ message: "Candidate Login Successfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});
// Employer login api
router.post("/employerLogin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    console.log(email, password);
    const employerLogin = await Employer.findOne({ email: email });
    if (employerLogin) {
      const isMatch = await bcrypt.compare(password, employerLogin.password);
      if (!isMatch) {
        res.status(400).json({ error: " Please Fill the Data" });
      } else {
        token = await employerLogin.generateAuthToken();
        console.log(token);
        res.cookie("jwttoken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true,
        });
        res.json({ message: "Employers Login Successfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

// Contactus Post  API
router.post("/contactus", async (req, res) => {
  try {
    const { fullname, email, subject, message } = req.body;
    if (!fullname || !email || !subject || !message) {
      return res.status(400).json({ error: "Please Fill the Data" });
    } else {
      const contactus = new Contactus({
        fullname: fullname,
        email: email,
        subject: subject,
        message,
      });
      await contactus.save();

      res.status(201).json({ message: "Thankyou " });
    }
  } catch (err) {
    console.log(err);
  }
});
// Contactus Get api
router.get("/contactus", async (req, res) => {
  try {
    const contactus = await Contactus.find();
    res.status(200).send(contactus);
  } catch (err) {
    console.log(err);
  }
});

//  Newsletter  Post Api keys
router.post("/newsletter", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Please Fill the Data" });
    } else {
      const newsletter = new Newsletter({
        email: email,
      });
      await newsletter.save();

      res.status(201).json({ message: "Thankyou " });
    }
  } catch (err) {
    console.log(err);
  }
});
//  Newsletter  Get Api keys
router.get("/newsletter", async (req, res) => {
  try {
    const newsletter = await Newsletter.find();
    res.status(200).send(newsletter);
  } catch (err) {
    console.log(err);
  }
});

// add job data api
router.post("/jobpost", upload.single("logo"), async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create new img with data
    const post = new JobPost({
      position: req.body.position,
      companyName: req.body.companyName,
      location: req.body.location,
      budget: req.body.budget,
      jobTime: req.body.jobTime,
      logo: result.secure_url,
      jobDescription: req.body.jobDescription,
      jobResponsibilities: req.body.jobResponsibilities,
      jobRequirements: req.body.jobRequirements,
      cloudinary_id: result.public_id,
    });
    // save image
    await post.save();
    res.json(post);
  } catch (error) {
    console.log(error);
  }
});
// Jobpost get  Data Api
router.get("/jobpost", async (req, res) => {
  try {
    const jobpost = await JobPost.find();
    res.status(200).json(jobpost);
  } catch (error) {
    console.log(error);
  }
});
// Jobpost Edit Api
router.put("/:id", upload.single("logo"), async (req, res) => {
  try {
    let user = await JobPost.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(user.cloudinary_id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    const data = {
      position: req.body.position || user.position,
      companyName: req.body.companyName,
      location: req.body.location || user.location,
      budget: req.body.budget || user.budget,
      jobTime: req.body.jobTime || user.jobTime,
      logo: result?.secure_url || user.logo,
      jobDescription: req.body.jobDescription || user.jobDescription,
      jobResponsibilities:
        req.body.jobResponsibilities || user.jobResponsibilities,
      jobRequirements: req.body.jobRequirements || user.jobRequirements,
      cloudinary_id: result?.public_id || user.cloudinary_id,
    };
    user = await JobPost.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

// Jobpost Delete Api
router.delete("/:id", async (req, res) => {
  try {
    // Find Jobpost by id
    const Jobpost = await JobPost.findById(req.params.id);
    // Delete JobPost data from cloudinary
    await cloudinary.uploader.destroy(Jobpost.cloudinary_id);
    // Delete Job From Db
    await JobPost.deleteOne();
    res.json(Jobpost);
  } catch (error) {
    console.log(error);
  }
});

// Gallery POST api
router.post("/gallery", upload.single("image"), async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result);
    // Create new img
    let user = new Gallery({
      category: req.body.category,
      image: result.secure_url,
      cloudinary: result.public_id,
    });
    // Save image
    await user.save();
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

// Gallery get api
router.get("/gallery", async (req, res) => {
  try {
    const gallery = await Gallery.find();
    res.status(201).json({ status: 200, gallery });
  } catch (e) {
    console.log(e);
  }
});
// // Gallery Delete api

// router.delete("/:id", async (req, res) => {
//   try {
//     // Find user by id
//     const  user = await Gallery.findById(req.params.id);
//     // Delete image from cloudinary
//     await cloudinary.uploader.destroy(user.cloudinary_id);
//     // Delete user from db
//     await user.deleteOne();
//     res.json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });
// Logout user
router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("logout successfully");
}),
  (module.exports = router);
