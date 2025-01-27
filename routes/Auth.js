const express = require("express");
const router = express.Router();

const {signUp,login,logOut} = require("../controllers/Auth");

router.post("/signUp",signUp);
router.post("/login",login);
router.post("/logout",logOut);

module.exports = router;
