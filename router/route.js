const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const mongoose = require("mongoose");
require("../db/conn");
const Candidate = require("../model/candidateSchema");
const Employer = require("../model/employerSchema");
const Contactus = require("../model/contactusShcema");
const Newsletter = require("../model/newsletterSchema");
const multer = require("multer");

// Create Storage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Create new Candidate  Registration api
router.post("/candidate", upload.single("file"), (req, res) => {
  console.log("Uploading candidate Registration api...");

  // const { name, number, email, resume, password, cpassword } = req.body;

  // if (!name || !number || !email || !resume || !password || !cpassword) {
  //   return res.status(402).send("Please fill all the fields");
  // }
  try {
    const candidateExist = Candidate.findOne({ email: email });
    if (candidateExist) {
      return res.status(400).send("Candidate already exists");
    } else if (password !== cpassword) {
      return res.status(404).send("Password does not match");
    } else {
      const candidate = new Candidate({
        name: req.body.name,
        number: req.body.number,
        email: req.body.email,
        resume: req.files.originalname,
        password: req.body.password,
        cpassword: req.body.cpassword,
      });

      candidate.save();
      res.status(200).send("Candidate created successfully");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
// Create Get candidate data
router.get("/candidate", async (req, res) => {
  try {
    const candidate = await Candidate.findOne();
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

  if (!industry || !companyName || !fullName || !number || !email) {
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

// Newsletter
// Logout user
router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("logout successfully");
}),
  (module.exports = router);
