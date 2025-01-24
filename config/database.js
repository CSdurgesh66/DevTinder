const mongoose  = require("mongoose");
require("dotenv").config();

DB_URL = process.env.DB_URL;

const dbConnect  = async () => {
     await mongoose.connect(DB_URL
    )
}

module.exports = dbConnect;