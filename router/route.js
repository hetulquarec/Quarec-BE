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

//  Gallery img storage path
const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./gallery");
  },
  filename: (req, file, callback) => {
    callback(null, `imgae-${Date.now()}. ${file.originalname}`);
  },
});

//  Gallery img filter
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("only images is allowd"));
  }
};
const upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
});
// Create new Candidate  Registration api
router.post("/candidate", async (req, res) => {
  // const { filename } = req.file;
  const { name, number, email, password, cpassword } = req.body;
  try {
    const date = moment(new Date().format("YYYY-MM-DD"));
    const candidate = new Candidate({
      name: name,
      number: number,
      email: email,
      // filepath: filename,
      password: password,
      cpassword: cpassword,
      date: date,
    });
    const finaldata = await candidate.save();
    res.status(201).send({ status: 201, finaldata });
  } catch (err) {
    res.status(401).json({ status: 401, error });
  }
});
//  Get candidate data
router.get("/candidate", async (req, res) => {
  try {
    const candidate = await Candidate.find();
    res.status(200).send(candidate);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create new employer Registration api
router.post("/employer", async (req, res) => {
  const {
    industry,
    companyName,
    fullName,
    number,
    email,
    password,
    cpassword,
  } = req.body;
  if (
    !industry ||
    !companyName ||
    !fullName ||
    !number ||
    !email ||
    !password ||
    !cpassword
  ) {
    return res.status(402).send("Please fill all the fields");
  }
  try {
    const employeeExist = await Employer.findOne({ email: email });
    if (employeeExist) {
      return res.status(400).send("Employee already exists");
    } else if (password !== cpassword) {
      return res.status(404).send("Password does not match");
    } else {
      const employee = new Employer({
        industry,
        companyName,
        fullName,
        number,
        email,
        password,
        cpassword,
      });
      await employee.save();
      res.status(200).send("Employer created successfully");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get Employers
router.get("/employer", async (req, res) => {
  try {
    const employer = await Employer.findOne();
    res.status(200).send(employer);
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

    if (!email || !password) {
      return res.status(400).json({ error: " Please Fill the Data" });
    }
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
    if ((!email, !password)) {
      return res.status(400).json({ error: " Please Fill the Data" });
    }
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
router.post("/jobpost", async (req, res) => {
  try {
    const {
      position,
      companyName,
      location,
      budget,
      jobTime,
      jobDescription,
      jobResponsibilities,
      jobRequirements,
    } = req.body;
    if (
      (!position,
      !companyName,
      !location,
      !budget,
      !jobTime,
      !jobDescription,
      !jobResponsibilities,
      !jobRequirements)
    ) {
      res.status(401).send({ message: " Fill all  required fields" });
    } else {
      const post = new JobPost({
        position,
        companyName,
        location,
        budget,
        jobTime,
        jobDescription,
        jobResponsibilities,
        jobRequirements,
      });
      await post.save();

      res.status(201).json({ message: "added job" });
    }
  } catch (e) {
    console.log(e);
  }
});
// get Job Data Api
router.get("/jobpost", async (req, res) => {
  try {
    const job = await JobPost.find();
    res.status(200).json(job);
  } catch (e) {
    console.log(e);
  }
});

// Jobpost Delete Api
router.delete("jobpost/:id",async(req,res)=>{

  try {
      const {id} = req.params;

      const dltUser = await users.findByIdAndDelete({_id:id});

      res.status(201).json({status:201,dltUser});

  } catch (error) {
      res.status(401).json({status:401,error})
  }

})

// Gallery POST api
router.post("/gallery", upload.single("photo"), async (req, res) => {
  const { category } = req.body;
  const { filename } = req.file;

  if (!category || !filename) {
    res.status(401).json({ status: 401, message: "fill all the data" });
  }
  try {
    const date = moment(new Date()).format("YYYY-MM-DD");

    const gallery = new Gallery({
      category: category,
      imgpath: filename,
    });
    const finaldata = await gallery.save();

    res.status(201).json({ status: 201, finaldata });
  } catch (e) {
    console.log(e);
  }
});

// Gallery get api
router.get("/gallery", async (req, res) => {
  try {
    const gallery = await Gallery.find();

    res.status(200).json({ status: 200, gallery });
  } catch (e) {
    console.log(e);
  } 
});
// Gallery Delete api

router.delete('/:id',  async (req, res) => {
  try {
    const {id} = req.params;
    
      const imageDelete = await Gallery.findOneAndDelete({ _id: id });
      if (!imageDelete) {
          return res.status(404).json({ error: "Gallery Image not found" });
      }
      res.status(200).json({ message: "Gallery Data Delete Successfully" });
  } catch (err) {
      console.log(err);
  }
}
);
// Logout user
router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("logout successfully");
}),
  (module.exports = router);
