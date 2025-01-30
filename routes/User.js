const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");

const {getAllRequest,getAllConnections,getFeed} = require("../controllers/User");


router.get("/user/requests/received",userAuth,getAllRequest);
router.get("/user/connections",userAuth,getAllConnections);
router.get("/user/feed",userAuth,getFeed);

module.exports = router

