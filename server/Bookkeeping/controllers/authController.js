const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const JWT_SECRET = 'your_jwt_secret';

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const [rows] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ user_id: user.user_id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('authToken', token, {
            httpOnly: false,
            secure: false,
            maxAge: 3600000
        });
        res.json({
            message: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: '用户名、邮箱和密码是必填的' });
    }
    try {
        const [existingUser] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: '该邮箱已被注册' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: '注册成功', user_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '注册失败，请稍后重试' });
    }
};
