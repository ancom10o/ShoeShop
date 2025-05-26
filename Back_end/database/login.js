const sql = require("mssql");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config/jwt.config');

// Hàm tạo token JWT với xử lý lỗi
const generateToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
  } catch (err) {
    console.error("Lỗi tạo token:", err);
    throw new Error("Không thể tạo token");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const request = new sql.Request(global.pool); // Sử dụng global pool
    const result = await request
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM [User] WHERE Username = @username");

    const user = result.recordset[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Tài khoản không tồn tại"
      });
    }

    if (password !== user.Password) {
      return res.status(401).json({
        success: false,
        message: "Sai mật khẩu"
      });
    }

    // Tạo token với thông tin user
    const token = generateToken({
      id: user.User_ID,
      name: user.Username,
      role: user.Role,
    });

    return res.status(200).json({
      success: true,
      token,
      role: user.Role,
      username: user.Username
    });
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ"
    });
  }
};

module.exports = login;