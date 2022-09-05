const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({
  industry: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  number: {
    type: "String",
    required: true,
  },
  password: {
    type: "String",
    required: true,
  },
  cpassword: {
    type: "String",
    required: true,
  },
  email: {
    type: "String",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// we are hashing the password
employerSchema.pre("save", async function (next) {
  console.log("Hii I am pre ");
  if (this.isModified("password")) {
    console.log("Hii I am pre password ");
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

// we are generating token
employerSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

const Users = mongoose.model("EMPLOYER", employerSchema);

module.exports = Users;
