
const sql = require("mssql");


const getProductListAll = async (req, res) => {
    try {
        const pool = global.pool;
        const result = await pool.request()
            .query(`
                SELECT 
                    p.Product_ID,
                    p.Name,
                    p.UnitPrice,
                    v.Size,
                    v.Color,
                    v.Stock,
                    p.Images
                FROM Product p
                JOIN Variant v ON p.Product_ID = v.Product_ID
            `);

        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi khi truy vấn danh sách sản phẩm:", err);
        res.status(500).json({ error: "Lỗi server khi lấy danh sách sản phẩm." });
    }
};

module.exports = getProductListAll;
