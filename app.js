const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(cookieParser());

dotenv.config({ path: ".env" });

require("./db/conn");

app.use(
  cors({
    origin: "*",
  })
);
app.options("*", cors());
app.use(express.json());

app.use(express.json());

app.use('/api',require("./router/route"));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is running at port no ${PORT}`);
});
