const express = require("express");
const router = express.Router();
const {userAuth} = require("../middlewares/auth");

const {requestSendInterested,requestReview} = require("../controllers/Request");

router.post("/request/send/:status/:toUserId",userAuth,requestSendInterested);
router.post("/request/review/:status/:requestId",userAuth,requestReview);

module.exports = router;
