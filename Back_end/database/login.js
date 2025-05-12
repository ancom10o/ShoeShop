const sql = require("mssql");
const jwt = require("jsonwebtoken");

const secretKey = "your_secret_key"; // Nên đặt trong biến môi trường .env

// Hàm tạo token JWT
const generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: "2h" });
};

const login = async (req, res) => {
  const { username, password } = req.body;
 

  try {
    const request = new sql.Request();
    const result = await request
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM [User] WHERE Username = @username");

    const user = result.recordset[0];


    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (password !== user.Password) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Tạo JWT token bằng hàm generateToken
    const token = generateToken({
      id: user.User_ID,
      name: user.Username,
      role: user.Role,
    });

 
    return res.status(200).json({
      token,
      role: user.Role,
      username: user.Username,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = login;
