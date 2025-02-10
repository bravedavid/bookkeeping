// authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';  // 用于生成 JWT 的密钥

module.exports = function (req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];  // 从 Authorization 头部获取 token
    
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // 将解码后的用户信息附加到请求中
        req.user = decoded;
        next();  // 调用下一个中间件或路由处理程序
    });
};

