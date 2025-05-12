const { request } = require("express");
const sql = require("mssql");

const EditSP = async (req, res) => {
    try {
       const productID = req.body.productID;

        const pool = global.pool;
     
        const result = await pool.request()
            .input("productID", sql.Int, productID)
            .query(`
                SELECT 
                    p.Product_ID,
                    p.Name,
                    p.Category,
                    p.Brand,
                    p.Gender,
                    p.UnitPrice,
                    p.Discount,
                
                    p.Images,
                    v.Color,
                    v.Size,
                    v.Stock
                FROM Product p
                JOIN Variant v ON p.Product_ID = v.Product_ID
                WHERE p.Product_ID = @productID
            `);
                console.log("ds",result.recordset);
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error("Lỗi khi truy vấn chi tiết sản phẩm:", err);
        res.status(500).json({ error: "Lỗi server khi lấy chi tiết sản phẩm." });
    }
};

module.exports = EditSP;
