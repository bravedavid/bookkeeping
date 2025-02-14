const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret';  // 用于生成 JWT 的密钥

function authenticateToken(req, res, next) {
    const token = req.cookies.authToken || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: '缺少认证 token' });
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: '无效的 token' });
        }
        req.user = user;  // 保存用户信息到请求中
        next();
    });
}

module.exports = authenticateToken;
