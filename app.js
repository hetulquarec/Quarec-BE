const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

dotenv.config({ path: './config.env' });

require('./db/conn');


app.use(express.json());

// we link the router files to make our route easy  
app.use(require('./router/route'));


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server is runnig at port no ${PORT}`);
})


