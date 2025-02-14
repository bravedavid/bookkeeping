const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const { getUserInfo, getBalance, getChildren } = require('../controllers/userController');

const router = express.Router();

router.post('/info', authenticateToken, getUserInfo);
router.post('/balance', authenticateToken, getBalance);
router.post('/getChildren', authenticateToken, getChildren);

module.exports = router;
