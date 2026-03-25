const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const user = require("./routes/Auth");
const profile = require("./routes/Profile");
const Sendrequest = require("./routes/Request");
const allRequest = require("./routes/User");
const chat  = require('./routes/Chat');
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");
require("dotenv").config();

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());


app.use("/", user);
app.use("/", profile);
app.use("/", Sendrequest);
app.use("/", allRequest);
app.use('/',chat);



const server = http.createServer(app);
initializeSocket(server);



dbConnect()
    .then(() => {
        console.log("Database connection established..");
        //     app.listen ->  server.listen 
        server.listen(process.env.PORT, '0.0.0.0', () => {
            console.log(`Server is running on port 3000`);
        });

    })
    .catch((error) => {
        console.error("database can not connected");
    })



app.get("/", (req, res) => {
    res.send("home, page!");
})
app.get('/hey', (req, res) => {
    res.send("hey how are you");
})