const express = require("express");
const router = express.Router();
const {userAuth} = require("../middlewares/auth");

const {requestSendInterested} = require("../controllers/Request");

router.post("/request/send/:status/:toUserId",userAuth,requestSendInterested);

module.exports = router;
