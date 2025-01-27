const express = require("express");
const router = express.Router();
const {userAuth} = require("../middlewares/auth");


const {getProfile,updateProfile} = require("../controllers/Profile");

router.get("/getprofile",userAuth,getProfile);
router.patch("/updateprofile",userAuth,updateProfile);

module.exports = router;