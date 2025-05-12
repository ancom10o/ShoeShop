const sql = require("mssql");

// Hàm xử lý API lấy thông tin người dùng
const getUserInfo = async (req, res) => {
  try {
    const userData = await findUserById(req.user.id);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("abvc",userData);
    res.json({
      id: userData.User_ID,
     
      role: userData.Role,
      account: userData.Username,
    });
    
  } catch (err) {
    console.error("GetUserInfo error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Hàm nội bộ để truy vấn dữ liệu người dùng từ DB
const findUserById = async (id) => {
  try {
    const pool = global.pool;
    const query = `SELECT * FROM [User] WHERE UserID = @id`;
    const result = await pool.request().input("id", sql.Int, id).query(query);
    console.log("jgfbg",result.recordset[0]);
    return result.recordset[0];
  } catch (err) {
    throw err;
  }
};

module.exports = 
  getUserInfo
;
