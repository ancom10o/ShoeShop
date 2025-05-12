const sql = require("mssql");



const getAccount = async (accountType, account) => {
  try {
    const pool = await sql.connect();
    const ps = new sql.PreparedStatement(pool);
    ps.input("account", sql.VarChar);

    let query = "SELECT * FROM [User] WHERE ";
    switch (accountType) {
      case "Username":
        query += "Username = @account";
        break;
      case "Phone":
        query += "Phone = @account";
        break;
      default:
        throw new Error("Invalid accountType. Use 'Username' or 'Phone'.");
    }

    await ps.prepare(query);
    const result = await ps.execute({ account });
    await ps.unprepare();

    return result.recordset[0];
  } catch (err) {
    throw err;
  }
};

module.exports = getAccount;
