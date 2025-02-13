// server.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const pool = require('./db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');


const app = express();
// 允许跨域
app.use(cors());
app.use(bodyParser.json());  // 解析 JSON 请求体
// 使用 cookie-parser 中间件
app.use(cookieParser());


const JWT_SECRET = 'your_jwt_secret';  // 用于生成 JWT 的密钥


// 中间件用于验证 token
function authenticateToken(req, res, next) {
 
  console.log(req?.cookies);
  const token = req?.cookies?.authToken || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: '缺少认证 token' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '无效的 token' });
    }
    req.user = user;  // 保存用户信息到请求中
    next();  // 调用下一个中间件或路由处理程序
  });
}


// 1. 为 React 静态文件设置托管
app.use(express.static(path.join(__dirname, 'static/web/build')));

// 登录接口
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 检查请求是否包含email和password
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // 查询数据库用户
        const [rows] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = rows[0];

        // 比对密码
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 生成 JWT
        const token = jwt.sign({ user_id: user.user_id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('authToken', token, {
      httpOnly: false,  // 客户端无法访问这个 cookie
      secure: false,    // 只有在 HTTPS 环境下才能使用
      maxAge: 3600000  // 1 小时有效期
    });

        // 返回 token 和用户信息
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
});



// 注册接口
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // 检查是否提供了所有必要的字段
    if (!username || !email || !password) {
        return res.status(400).json({ message: '用户名、邮箱和密码是必填的' });
    }

    try {
        // 检查邮箱是否已被注册
        const [existingUser] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: '该邮箱已被注册' });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 插入新用户数据
        const [result] = await pool.execute(
            'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        // 返回成功响应
        res.status(201).json({ message: '注册成功', user_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '注册失败，请稍后重试' });
    }
});

// 查询总余额接口
app.post('/api/balance', authenticateToken, async (req, res) => {
    const  userId  = req.user.user_id;
    // 从 Accounts 表中查询用户的总余额
    try {
        const [total_balance] = await pool.execute('SELECT * FROM Accounts WHERE user_id = ?', [userId]);
        if (total_balance.length > 0) {
            // 返回用户余额
            const balance = total_balance[0].total_balance;
            const star =  total_balance[0].star;
            return  res.json({ total_balance: balance , star : star});
        }  else if (total_balance.length === 0) {
            return res.status(404).json({ message: '未找到用户余额信息' });
        }
    } catch (err) {
        return res.status(500).json({ message: '数据库查询失败', error: err.message });
    }

});

app.post('/api/getUserinfo', authenticateToken, async (req, res) => {
    const  userId  = req.user.user_id;

    // 从 Accounts 表中查询用户的总余额
    const [rows] = await pool.execute('SELECT * FROM Users WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    res.json({
        message: 'Login successful',
        user: {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
        },
    });

});

// 减少账户余额的接口
app.post('/api/accounts/decrease', authenticateToken, async (req, res) => {
    const user_id = req.user.user_id;
    const { amount, description, payment_type } = req.body;

    if (amount <= 0) {
        return res.status(400).json({ error: '减少的金额必须大于0' });
    }

    try {
        const transaction_type = 'expense';
        let query = '';
        if ( payment_type === 'money') {
            query = 'UPDATE Accounts SET total_balance = total_balance - ? WHERE user_id = ?';
        } else if (payment_type === 'star'){
            query = 'UPDATE Accounts SET star = star - ? WHERE user_id = ?';
        }
        const [results] = await pool.execute(query, [amount, user_id]);
        query = 'INSERT INTO Transactions (user_id, amount, transaction_type, payment_type, description) VALUES (?, ?, ?, ?, ?)';
        const [results2] = await pool.execute(query, [user_id, amount, 'expense', payment_type, description]);
        return  res.json({
            message: 'decrease successful',
        });
    }catch (err) {
        return res.status(500).json({ message: '数据库查询失败', error: err.message });
    }

});


// 查询交易记录的接口
app.post('/api/getTransactions',  authenticateToken, async (req, res) => {
    const user_id = req.user.user_id;
    const { transaction_type, start_date, end_date } = req.body;

    try {
        let query = 'SELECT * FROM Transactions WHERE user_id = ?';
        const params = [user_id];

        // 根据查询参数构建查询条件
        if (transaction_type) {
            query += ' AND transaction_type = ?';
            params.push(transaction_type);
        }
        if (start_date) {
            query += ' AND transaction_date >= ?';
            params.push(start_date);
        }
        if (end_date) {
            query += ' AND transaction_date <= ?';
            params.push(end_date);
        }

        const [results] = await pool.execute(query, params);
        res.json({
            message: 'success',
            data: results,
        });
    } catch (err) {
        console.error('查询交易记录失败:', err);
        res.status(500).json({ error: '查询交易记录失败' });
    }
});



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/web/build/index.html'));
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

