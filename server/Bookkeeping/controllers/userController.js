const pool = require('../db');

exports.getUserInfo = async (req, res) => {
    const userId = req.user.user_id;
    const [rows] = await pool.execute('SELECT * FROM Users WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = rows[0];
    res.json({
        message: 'User info retrieved successfully',
        user: {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            child: user.child,
        },
    });
};

exports.getBalance = async (req, res) => {
    let userId = req.user.user_id;
    const { child_id } = req.body;
    if (child_id) {
        userId = child_id;
    }
    try {
        const [total_balance] = await pool.execute('SELECT * FROM Accounts WHERE user_id = ?', [userId]);
        if (total_balance.length > 0) {
            const balance = total_balance[0].total_balance;
            const star = total_balance[0].star;
            return res.json({ total_balance: balance, star: star });
        } else {
            return res.status(404).json({ message: '未找到用户余额信息' });
        }
    } catch (err) {
        return res.status(500).json({ message: '数据库查询失败', error: err.message });
    }
};


// 查询某个用户下所有孩子的信息
exports.getChildren = async (req, res) => {
    const userId = req.user.user_id;

    try {
        // 查询该用户的孩子 ID
        const [childrenIds] = await pool.query(`SELECT child_id FROM Relationships WHERE parent_id = ?`, [userId]);

        // 如果没有孩子，返回空数组
        if (childrenIds.length === 0) {
            return res.json([]);
        }

        // 获取所有孩子的 ID
        const childIds = childrenIds.map(row => row.child_id);

        // 查询孩子的详细信息
        const [childrenResults] = await pool.query(`SELECT * FROM Users WHERE user_id IN (?)`, [childIds]);

        // 返回孩子信息
        res.json(childrenResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Database query failed'});
    }
};
