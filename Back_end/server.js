const express = require("express");
const cors = require("cors");
const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cors({
  origin: [

    /http:\/\/127\.0\.0\.1:300\d/, // please do not change
    /http:\/\/localhost:300\d/, // please do not change
    /http:\/\/127\.0\.0\.1:500\d/, // please do not change
    /http:\/\/localhost:500\d/,
    /http:\/\/127\.0\.0\.1:550\d/, // please do not change
    /http:\/\/localhost:550\d/,
  ], // Chỉ định origin được phép truy cập
  credentials: true, // Cho phép gửi cookie hoặc session
}));

const connectDB = require("./connectDB.js");



const checkAccount = require("./controller/checkAccount.js");
app.post("/checkAccount", checkAccount);
const register = require("./database/register.js");
app.post("/register", register);
const getProductListAll = require("./database/getProductListAll.js");
app.post("/getProductListAll", getProductListAll);

const EditSP = require("./database/EditSP.js");
app.post("/EditSP", EditSP);

const updateProduct = require("./database/updateProduct.js");
app.put("/UpdateProduct", updateProduct);

const DeleteProduct = require("./database/DeleteProduct.js");
app.delete("/DeleteProduct", DeleteProduct);

const addProduct = require("./database/AddProduct.js");
app.post("/AddProduct", addProduct);

const getAllCustomers = require("./database/getAllCustomers.js");
app.get("/getAllCustomers", getAllCustomers);

const getCustomerById = require('./database/getCustomerById.js');
app.get('/getCustomerById/:id', getCustomerById);

const deleteCustomer = require('./database/deleteCustomer.js');
app.delete("/deleteCustomer/:id", deleteCustomer);

const login = require("./database/login.js");
app.post("/login", login);

const getUSerInfo = require("./database/getUSerInfo.js");
app.post("/getUSerInfo", getUSerInfo);

const checkUserName = require("./database/checkUserName.js");
app.post("/checkUserName", checkUserName);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  (async () => {
    global.pool = await connectDB();  
  })();
});