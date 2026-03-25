const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { getChatHistory } = require('../controllers/Chat');

const router = express.Router();

router.get('/chat/:targetUserId',userAuth,getChatHistory);

module.exports = router;