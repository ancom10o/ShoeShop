const express = require("express");
const cors = require("cors");
const { verifyAdminToken } = require('./middleware/authMiddleware');
const PORT = 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    /http:\/\/127\.0\.0\.1:300\d/, // please do not change
    /http:\/\/localhost:300\d/, // please do not change
    /http:\/\/127\.0\.0\.1:500\d/, // please do not change
    /http:\/\/localhost:500\d/,
    /http:\/\/127\.0\.0\.1:550\d/, // please do not change
    /http:\/\/localhost:550\d/,
  ],
  credentials: true,
}));

// Database connection
const connectDB = require("./connectDB.js");

//Order
const createOrder = require("./database/createOrder.js");
const getOrderList = require("./database/getOrderList.js");

// Order routes
app.post("/createOrder", createOrder);
app.get("/getOrderList", verifyAdminToken, getOrderList);
////
//Searh

const searchProducts = require("./database/searchProducts.js");
app.get("/searchProducts", searchProducts);

//Cart
const addToCart = require("./database/addToCart.js");

// Add to Public Routes section
app.post("/addToCart", addToCart);

// Import public routes
const checkAccount = require("./controller/checkAccount.js");
const register = require("./database/register.js");
const login = require("./database/login.js");
const checkUserName = require("./database/checkUserName.js");
const getProductListAll = require("./database/getProductListAll.js");
const getUSerInfo = require("./database/getUSerInfo.js");

// Import admin routes
const EditSP = require("./database/EditSP.js");
const updateProduct = require("./database/updateProduct.js");
const DeleteProduct = require("./database/DeleteProduct.js");
const addProduct = require("./database/AddProduct.js");
const getAllCustomers = require("./database/getAllCustomers.js");
const getCustomerById = require('./database/getCustomerById.js');
const deleteCustomer = require('./database/deleteCustomer.js');

// Public Routes
app.post("/checkAccount", checkAccount);//ok
app.post("/register", register);//ok
app.post("/login", login);//ok
app.post("/checkUserName", checkUserName);//ok
app.post("/getProductListAll", getProductListAll);
app.post("/getUSerInfo", getUSerInfo);

// Protected Admin Routes
app.post("/EditSP", verifyAdminToken, EditSP);//ok
app.put("/UpdateProduct", verifyAdminToken, updateProduct);
app.delete("/DeleteProduct", verifyAdminToken, DeleteProduct);
app.post("/AddProduct", verifyAdminToken, addProduct);//ok
app.get("/getAllCustomers", verifyAdminToken, getAllCustomers);//ok
app.get("/getCustomerById/:id", verifyAdminToken, getCustomerById);//ok
app.delete("/deleteCustomer/:id", verifyAdminToken, deleteCustomer);//ok

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  (async () => {
    try {
      global.pool = await connectDB();
      console.log("Database connected successfully!");
    } catch (err) {
      console.error("Database connection failed:", err);
      process.exit(1);
    }
  })();
});