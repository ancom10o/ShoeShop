const { request } = require("express");
const sql = require("mssql");


const register = async (request, response) => {
  const { username, password, phone } = request.body;
  console.log(request.body);
  if (!username || !password || !phone) {
    return { status: 400, message: 'Missing required fields.' };
  }

  try {
    const pool = global.pool;

    // Kiểm tra username đã tồn tại chưa
    const checkUsername = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM [User] WHERE Username = @username');

    if (checkUsername.recordset.length > 0) {
      return { status: 409, message: 'Username already exists.' };
    }

    // Kiểm tra phone đã tồn tại chưa
    const checkPhone = await pool.request()
      .input('phone', sql.VarChar, phone)
      .query('SELECT * FROM [User] WHERE Phone = @phone');

    if (checkPhone.recordset.length > 0) {
      response.status(409).json({ status: 409, message: 'Phone number already in use.' });
    }

    // Thêm user mới
    await pool.request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, password)
      .input('phone', sql.VarChar, phone)
      .input('role', sql.VarChar, 'customer')
      .query(`
        INSERT INTO [User](Username, Password, Phone, Role, Create_date)
        VALUES (@username, @password, @phone, @role, GETDATE())
      `);

    response.status(201).json({ status: 201, message: 'User registered successfully.' });
  } catch (err) {
    console.error('Register error:', err.message);
    return { status: 500, message: 'Internal server error.' };
  }
};

module.exports = register;
