const getAccount = require("../database/getAccount.js");

const checkAccount = async (req, res) => {
  const { accountType, account } = req.body;
  console.log(req.body);
  const userData = await getAccount(accountType, account);
  if (userData) {
    return res.status(200).json({ message: "Account found" });
  } else {
  
    return res.status(404).json({ message: "Account not found" });

  }
};

module.exports = checkAccount;