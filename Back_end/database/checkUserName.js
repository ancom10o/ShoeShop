const sql = require("mssql");

const checkUserName = async (req, res) => {
    try {
        const { account } = req.body;

        if (!account) {
            return res.status(400).json({
                success: false,
                message: "Account is required"
            });
        }

        const pool = global.pool;
        const result = await pool
            .request()
            .input("account", sql.VarChar, account)
            .query(`
                SELECT * FROM [User] 
                WHERE Username = @account OR Phone = @account
            `);

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            return res.status(200).json({
                success: true,
                message: user.Phone === account ? "Phone number exists" : "Username exists",
                data: {
                    User_ID: user.User_ID,
                    Username: user.Username,
                    Role: user.Role,
                    Create_date: user.Create_date
                }
            });
        }

        return res.status(404).json({
            success: false,
            message: "Account not found"
        });

    } catch (err) {
        console.error("CheckUserName Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = checkUserName;