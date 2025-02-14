let cron = require('node-cron');
const pool = require('../db');


exports.cronTask =  () => {
    cron.schedule('0 18 * * *', async () => {
        console.log('增加利息');
        try {
            const user_id = 1;
            const description = '利息';
            const [total_balance] = await pool.execute('SELECT * FROM Accounts WHERE user_id = ?', [user_id]);
            const amount = total_balance[0].total_balance / 8000;
            const payment_type = 'money';
            await pool.execute('INSERT INTO Transactions (user_id, amount, transaction_type, payment_type, description) VALUES (?, ?, ?, ?, ?)', [user_id, amount.toFixed(2), 'income', payment_type, description]);
        } catch (err) {
            console.log(err);
        }
    });
}
