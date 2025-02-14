const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const { decreaseBalance, getTransactions, increaseBalance } = require('../controllers/transactionController');

const router = express.Router();

router.post('/decrease', authenticateToken, decreaseBalance);
router.post('/increase', authenticateToken, increaseBalance);
router.post('/', authenticateToken, getTransactions);

module.exports = router;
