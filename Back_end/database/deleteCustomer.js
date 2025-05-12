const sql = require("mssql");

const deleteCustomer = async (req, res) => {
    try {
        const userId = req.params.id;
        const pool = global.pool;

        const result = await pool.request()
            .input('UserId', sql.VarChar, userId)
            .query(`
                DELETE FROM [User]
                WHERE Role = 'customer' AND User_ID = @UserId
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng để xoá." });
        }

        res.json({ message: "Đã xoá khách hàng khỏi hệ thống." });
    } catch (error) {
        console.error("Lỗi khi xoá khách hàng:", error);
        res.status(500).json({ message: "Lỗi server khi xoá khách hàng." });
    }
};

module.exports = deleteCustomer;
