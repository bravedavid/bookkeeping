const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const cron = require('./cron/cron');

const app = express();

// Middleware
// app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static/web/build')));

// 执行定时任务
// 启动的同时启动定时任务
cron.cronTask();
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Serve React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/web/build/index.html'));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
