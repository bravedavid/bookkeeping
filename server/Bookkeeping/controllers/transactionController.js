const pool = require('../db');

exports.decreaseBalance = async (req, res) => {
    let user_id = req.user.user_id;
    const { amount, description, payment_type, child_id } = req.body;
    if (child_id) {
        user_id = child_id;
    }
    if (amount <= 0) {
        return res.status(400).json({ error: '减少的金额必须大于0' });
    }
    try {
        let query = '';
        if (payment_type === 'money') {
            query = 'UPDATE Accounts SET total_balance = total_balance - ? WHERE user_id = ?';
        } else if (payment_type === 'star') {
            query = 'UPDATE Accounts SET star = star - ? WHERE user_id = ?';
        }
        await pool.execute(query, [amount, user_id]);
        await pool.execute('INSERT INTO Transactions (user_id, amount, transaction_type, payment_type, description) VALUES (?, ?, ?, ?, ?)', [user_id, amount, 'expense', payment_type, description]);
        return res.json({ message: '减少账户余额成功' });
    } catch (err) {
        return res.status(500).json({ message: '数据库查询失败', error: err.message });
    }
};

exports.increaseBalance = async (req, res) => {
    let user_id = req.user.user_id;
    const { amount, description, payment_type, child_id } = req.body;
    if (child_id) {
        user_id = child_id;
    }
    if (amount <= 0) {
        return res.status(400).json({ error: '减少的金额必须大于0' });
    }
    try {
        let query = '';
        if (payment_type === 'money') {
            query = 'UPDATE Accounts SET total_balance = total_balance + ? WHERE user_id = ?';
        } else if (payment_type === 'star') {
            query = 'UPDATE Accounts SET star = star + ? WHERE user_id = ?';
        }
        await pool.execute(query, [amount, user_id]);
        await pool.execute('INSERT INTO Transactions (user_id, amount, transaction_type, payment_type, description) VALUES (?, ?, ?, ?, ?)', [user_id, amount, 'income', payment_type, description]);
        return res.json({ message: '增加账户余额成功' });
    } catch (err) {
        return res.status(500).json({ message: '数据库查询失败', error: err.message });
    }
};

exports.getTransactions = async (req, res) => {
    let user_id = req.user.user_id;
    const { transaction_type, start_date, end_date, child_id } = req.body;
    if (child_id) {
        user_id = child_id;
    }

    try {
        let query = 'SELECT * FROM Transactions WHERE user_id = ?';
        const params = [user_id];

        // 可选条件处理
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

        // 添加排序和限制
        query += ' ORDER BY transaction_date DESC LIMIT 50';

        const [results] = await pool.execute(query, params);
        res.json({ message: '交易记录查询成功', data: results });
    } catch (err) {
        console.error('查询交易记录失败:', err);
        res.status(500).json({ error: '查询交易记录失败' });
    }
};
