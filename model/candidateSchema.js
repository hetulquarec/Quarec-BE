const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const candidatesSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  number: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  cpassword: {
    type: String,
  },
  file: {
    type: String,
  },
  cloudinary_id: {
      type: String,
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
candidatesSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

// we are generating token
candidatesSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

const Users = mongoose.model("CANDIDATE", candidatesSchema);

module.exports = Users;
