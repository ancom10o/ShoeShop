const sql = require("mssql");

const getCustomerById = async (req, res) => {
    try {
        const userId = req.params.id;
        const pool = global.pool;

        const result = await pool.request()
            .input('UserId', sql.VarChar, userId)
            .query(`
                SELECT 
                    User_ID,
                    Username,
                    Phone,
                    Role,
                    Create_date
                FROM [User]
                WHERE Role = 'customer' AND User_ID = @UserId
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng." });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error("Lỗi khi lấy khách hàng:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
};

module.exports = getCustomerById;
