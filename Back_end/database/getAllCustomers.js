const sql = require("mssql");

const getAllCustomers = async (req, res) => {
    try {
        const pool = global.pool;
        const result = await pool.request()
            .query(`
                SELECT 
                    User_ID,
                    Username,
                    Phone,
                    Role,
                    Create_date
                FROM [User]
                WHERE Role = 'customer'
            `);
   
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi khi truy vấn danh sách khách hàng:", err);
        res.status(500).json({ error: "Lỗi server khi lấy danh sách khách hàng." });
    }
};

module.exports = getAllCustomers;

